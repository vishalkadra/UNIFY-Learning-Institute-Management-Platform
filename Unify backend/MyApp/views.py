from django.db.migrations import serializer
from django.db import transaction
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsStaffOrSuperuserOnly,CanSubmitComplaint
from .authentication import ExpiringTokenAuthentication, issue_token
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import (
    EmailOTP,
    PendingRegistration,
    User,
    Query,
    Course,
    Expert,
    Placement,
    CourseModule,
)
from .otp import (
    OTPError, request_otp, verify_otp, request_registration_otp, verify_registration_otp,
)
from .serializers import (
    ChangePasswordSerializer,
    CourseSerializer,
    LoginSerializer,
    RegisterSerializer,
    RequestOTPSerializer,
    ResetPasswordWithOTPSerializer,
    UserSerializer,
    VerifyEmailOTPSerializer,
    QuerySerializer,
    ManageUserSerializer,
    PlacementSerializer,
    ExpertSerializer,
    CourseModuleSerializer,
)


def _token_payload(user, request):
    token = issue_token(user, device_info=request.META.get("HTTP_USER_AGENT", ""))
    return {
        "user": UserSerializer(user).data,
        "token": token.key,
        "expires_at": token.expires_at,
    }


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data["email"].strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            return Response({"detail": "An account with this email already exists. Please log in."}, status=status.HTTP_400_BAD_REQUEST)

        pending, _ = PendingRegistration.objects.get_or_create(
            email=email,
            defaults={
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                "password_hash": "pending",
                "code_hash": "pending",
                "expires_at": timezone.now(),
            },
        )
        try:
            request_registration_otp(
                pending,
                data["first_name"],
                data["last_name"],
                data["password"],
            )
        except OTPError as exc:
            transaction.set_rollback(True)
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
        except Exception:
            transaction.set_rollback(True)
            return Response({"detail": "Could not send OTP email. Please check email settings and try again."}, status=status.HTTP_502_BAD_GATEWAY)

        return Response(
            {"message": "OTP sent. Verify your email to complete registration.", "email": email, "verified": False},
            status=status.HTTP_201_CREATED,
        )

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        if not user.is_verified:
            return Response({"detail": "Please verify your email with OTP."}, status=status.HTTP_403_FORBIDDEN)
        return Response(_token_payload(user, request))




class LogoutView(APIView):
    """
    POST /logout/

    Logs out only the device/token used for this request.
    """

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        token = request.auth

        if token:
            token.delete()

        return Response(
            {"detail": "Logout successful."},
            status=status.HTTP_200_OK,
        )


class LogoutAllView(APIView):
    """
    POST /logout-all/

    Logs the user out from all devices.
    """

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request.user.auth_tokens.all().delete()

        return Response(
            {"detail": "Logged out from all devices."},
            status=status.HTTP_200_OK,
        )
class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/me/ -> view or update the authenticated user's profile."""

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ {old_password, new_password}
    -> revokes all existing tokens and returns a fresh one."""

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        user.auth_tokens.all().delete()  # force re-login everywhere
        return Response(_token_payload(user, request))


class RequestOTPView(APIView):
    """
    POST /api/auth/otp/send/  {email, purpose: "verify_email"|"password_reset"}

    Always responds 200 with the same generic message, whether or not the
    email is registered — this stops the endpoint being used to check which
    emails have accounts. Only a genuine cooldown hit returns 429.
    """

    permission_classes = [permissions.AllowAny]
    GENERIC_OK = {"detail": "If that email is registered, a code has been sent."}

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        purpose = serializer.validated_data["purpose"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(self.GENERIC_OK)

        if purpose == EmailOTP.Purpose.VERIFY_EMAIL and user.is_verified:
            return Response({"detail": "This account is already verified."})
        try:
            request_otp(user, purpose)
        except OTPError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        return Response(self.GENERIC_OK)


class VerifyEmailOTPView(APIView):
    """Verify a pending registration first; retain existing verification for old users."""
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = VerifyEmailOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"].strip().lower()
        code = serializer.validated_data["code"]

        try:
            pending = PendingRegistration.objects.get(email__iexact=email)
        except PendingRegistration.DoesNotExist:
            pending = None

        if pending is not None:
            try:
                user = verify_registration_otp(pending, code)
            except OTPError as exc:
                return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"message": "Email verified. Registration completed. Please log in.", "email": user.email, "verified": True}, status=status.HTTP_200_OK)

        # Backward-compatible verification for accounts created before this flow.
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": "Incorrect code or registration not found."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            verify_otp(user, code, EmailOTP.Purpose.VERIFY_EMAIL)
        except OTPError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        user.is_verified = True
        user.save(update_fields=["is_verified"])
        return Response({"message": "Email verified. Please log in.", "email": user.email, "verified": True})

class ResetPasswordWithOTPView(APIView):
    """POST /api/auth/otp/reset-password/  {email, code, new_password}
    Verifies the code and sets the new password in one step, then revokes
    every existing session token for that user."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordWithOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"detail": "Incorrect code."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            verify_otp(user, code, EmailOTP.Purpose.PASSWORD_RESET)
        except OTPError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save(update_fields=["password"])
        user.auth_tokens.all().delete()  # force re-login everywhere, including this request's own token
        return Response(_token_payload(user, request))


class QueryViewSet(viewsets.ModelViewSet):

    authentication_classes = [ExpiringTokenAuthentication]

    queryset = Query.objects.all()
    serializer_class = QuerySerializer

    def get_permissions(self):

        # Anyone can submit complaint
        if self.action == "create":
            return [CanSubmitComplaint()]

        # Only logged-in regular (non-staff, non-superuser) users can submit a complaint
        return [IsStaffOrSuperuserOnly()]

    def perform_create(self, serializer):

        # request.user is guaranteed authenticated here (CanSubmitComplaint enforces it)
        query = serializer.save(email=self.request.user.email)

        # Database se complaint karne wale ka email
        user_email = query.email

        # Confirmation email
        send_mail(
            subject="Complaint Received - Unify",

            message=f"""
Hello {query.name},

We have received your complaint successfully.

Complaint Type:
{query.type}

Your Problem:
{query.problem}

Status:
Pending

Our team will review your complaint and resolve it as soon as possible.

Thank you for contacting Unify.

Regards,
Unify Team
""",

            from_email=settings.DEFAULT_FROM_EMAIL,

            recipient_list=[user_email],

            fail_silently=False,
        )

    def perform_update(self, serializer):
        # Existing complaint
        old_query = self.get_object()
        # Old resolved value
        old_resolved = old_query.resolved

        # Updated complaint save karo
        query = serializer.save()
        # Check:
        # Pehle resolved False tha
        # Ab resolved True ho gaya
        if old_resolved is False and query.resolved is True:

            send_mail(
                subject="Complaint Resolved - Unify",

                message=f"""
Hello {query.name},

Good news!

Your complaint has been successfully resolved.

Complaint Type:
{query.type}

Your Problem:
{query.problem}

Status:
Resolved

Thank you for contacting Unify.

If you have any other issue, please feel free to contact us.

Regards,
Unify Team
""",

                from_email=settings.DEFAULT_FROM_EMAIL,

                recipient_list=[query.email],

                fail_silently=False,
            )
class  AdminStatsView(APIView):
    """
    GET /admin-stats/ -> returns counts of users, queries, and other relevant stats for the admin dashboard.
    """
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsStaffOrSuperuserOnly]

    def get(self, request):
        #Total registered users
        total_users = User.objects.count()

        # Total staff users
        total_staff = User.objects.filter(
            is_staff=True
        ).count()

        # Total superusers
        total_superusers = User.objects.filter(
            is_superuser=True
        ).count()

         # Total courses
        total_courses = Course.objects.count()

        # Total experts
        total_experts = Expert.objects.count()

        # Total placement drives
        total_placements = Placement.objects.count()

        
        # Complaints that are not resolved
        pending_complaints = Query.objects.filter(
            resolved=False
        ).count()

        return Response({
            "total_users": total_users,
            "total_staff": total_staff,
            "total_superusers": total_superusers,
            "total_courses": total_courses,
            "total_experts": total_experts,
            "total_placements": total_placements,
            "pending_complaints": pending_complaints,
        })


class ManageUserView(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsStaffOrSuperuserOnly]

    def get(self, request):
        users = User.objects.all()
        serializer = ManageUserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if "is_staff" in request.data:
            user.is_staff = request.data["is_staff"]

        if "is_superuser" in request.data:
            user.is_superuser = request.data["is_superuser"]

        user.save()

        serializer = ManageUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.id == request.user.id:
            return Response(
                {"error": "You cannot delete your own account"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.delete()

        return Response(
            {"message": "User deleted successfully"},
            status=status.HTTP_200_OK
        )



class CourseViewSet(viewsets.ModelViewSet):
   queryset = Course.objects.all()
   serializer_class = CourseSerializer
   def get_permissions(self):
       if self.action== "list": 
            return [permissions.AllowAny()]
       return [IsStaffOrSuperuserOnly()]

class CourseModuleViewSet(viewsets.ModelViewSet):
    queryset = CourseModule.objects.all()
    serializer_class = CourseModuleSerializer

    def get_permissions(self):
        if self.action == "list":
            return [permissions.AllowAny()]
        return [IsStaffOrSuperuserOnly()]
   

class PlacementViewSet(viewsets.ModelViewSet):
   queryset = Placement.objects.all()
   serializer_class = PlacementSerializer
   def get_permissions(self):
       if self.action== "list": 
            return [permissions.AllowAny()]
       return [IsStaffOrSuperuserOnly()]


class ExpertViewSet(viewsets.ModelViewSet):
    queryset = Expert.objects.all()
    serializer_class = ExpertSerializer
    def get_permissions(self):
         if self.action in ["list", "retrieve"]: 
                return [permissions.AllowAny()]
         return [IsStaffOrSuperuserOnly()]

   
      
     
