import razorpay
import hmac
import hashlib

from decimal import Decimal, ROUND_HALF_UP
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView

from MyApp.authentication import ExpiringTokenAuthentication
from MyApp.models import Course, User

from .models import Enrollment, Notification, OnlineClass
from .permissions import StaffOnly
from .serializers import EnrollmentSerializer, NotificationSerializer, OnlineClassSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Enrollment.objects.select_related("user", "course").all()
        return Enrollment.objects.select_related("course").filter(user=self.request.user)

    def get_permissions(self):
        if self.action in ["list", "retrieve", "create"]:
            return [permissions.IsAuthenticated()]
        return [StaffOnly()]

    def create(self, request, *args, **kwargs):
        course_id = request.data.get("course")
        if not course_id:
            return Response({"course": "Course is required."}, status=400)
        try:
            Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response({"course": "Course not found."}, status=404)

        enrollment, _ = Enrollment.objects.get_or_create(
            user=request.user, course_id=course_id
        )
        # Payment gateway will call the paid confirmation later.
        serializer = self.get_serializer(enrollment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[StaffOnly])
    def mark_paid(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.mark_paid()
        Notification.objects.create(
            user=enrollment.user,
            title="Course access activated",
            message=f"Your access to {enrollment.course.name} is now active. You can open Online Classes from the navbar.",
        )
        return Response(self.get_serializer(enrollment).data)
    
    @action(detail=True, methods=["post"], permission_classes=[StaffOnly])
    def deactivate(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.status = "pending"
        enrollment.save(update_fields=["status"])

        Notification.objects.create(
            user=enrollment.user,
            title="Course access deactivated",
            message=f"Your access to {enrollment.course.name} has been deactivated."
        )

        return Response(self.get_serializer(enrollment).data)



class NotificationViewSet(viewsets.ModelViewSet):
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = NotificationSerializer

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Notification.objects.select_related("user").all()
        return Notification.objects.filter(
            Q(user=self.request.user) | Q(user__isnull=True)
        )

    def get_permissions(self):
        if self.action in ["list", "retrieve", "partial_update", "update","read_all"]:
            return [permissions.IsAuthenticated()]
        return [StaffOnly()]

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        user_id = data.get("user")
        if user_id in ("", None, "null"):
            users = User.objects.filter(is_active=True, is_staff=False, is_superuser=False)
            created = []
            for user in users:
                created.append(Notification.objects.create(
                    user=user,
                    title=data.get("title", ""),
                    message=data.get("message", ""),
                ))
            return Response(self.get_serializer(created, many=True).data, status=status.HTTP_201_CREATED)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(self.get_serializer(obj).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        notification = self.get_object()
        if not (request.user.is_staff or request.user.is_superuser) and notification.user not in (None, request.user):
            return Response({"detail": "Not allowed."}, status=403)
        serializer = self.get_serializer(notification, data={"is_read": bool(request.data.get("is_read", True))}, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def read_all(self, request):
        Notification.objects.filter(
            Q(user=request.user) | Q(user__isnull=True), is_read=False
        ).update(is_read=True)
        return Response({"detail": "All notifications marked as read."})


class OnlineClassViewSet(viewsets.ModelViewSet):
    authentication_classes = [ExpiringTokenAuthentication]
    serializer_class = OnlineClassSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [StaffOnly()]

    def get_queryset(self):
        qs = OnlineClass.objects.select_related("course")
        if self.request.user.is_staff or self.request.user.is_superuser:
            return qs
        purchased = Enrollment.objects.filter(
            user=self.request.user, status="paid"
        ).values_list("course_id", flat=True)
        return qs.filter(course_id__in=purchased, is_active=True)

    def perform_create(self, serializer):
        obj = serializer.save()
        users = Enrollment.objects.filter(course=obj.course, status="paid").values_list("user_id", flat=True)
        for user_id in users:
            Notification.objects.create(
                user_id=user_id,
                title="New online class scheduled",
                message=f"{obj.title} for {obj.course.name} starts on {obj.start_at:%d %b %Y, %I:%M %p}.",
            )

    def perform_update(self, serializer):
        obj = serializer.save()
        users = Enrollment.objects.filter(course=obj.course, status="paid").values_list("user_id", flat=True)
        for user_id in users:
            Notification.objects.create(
                user_id=user_id,
                title="Online class updated",
                message=f"{obj.title} for {obj.course.name} has been updated.",
            )


class LearningStatsView(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [StaffOnly]

    def get(self, request):
        return Response({
            "total_enrollments": Enrollment.objects.count(),
            "paid_enrollments": Enrollment.objects.filter(status="paid").count(),
            "upcoming_classes": OnlineClass.objects.filter(
                start_at__gt=timezone.now(), is_active=True
            ).count(),
            "live_classes": sum(1 for c in OnlineClass.objects.filter(is_active=True) if c.state == "live"),
            "notifications": Notification.objects.count(),
        })


class StudentLearningSummaryView(APIView):
    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user, status="paid")
        classes = OnlineClass.objects.filter(
            course_id__in=enrollments.values_list("course_id", flat=True),
            is_active=True,
        ).select_related("course")
        notifications = Notification.objects.filter(
            Q(user=request.user) | Q(user__isnull=True)
        )
        return Response({
            "enrolled_courses": EnrollmentSerializer(enrollments, many=True).data,
            "classes": OnlineClassSerializer(classes, many=True).data,
            "unread_notifications": notifications.filter(is_read=False).count(),
        })



class CreateRazorpayOrderView(APIView):

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        course_id = request.data.get("course_id")

        if not course_id:
            return Response(
                {"error": "Course ID is required."},
                status=400
            )

        try:
            course = Course.objects.get(pk=course_id)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=404
            )

        enrollment, _ = Enrollment.objects.get_or_create(
            user=request.user,
            course=course
        )

        if enrollment.status == "paid":
            return Response(
                {"error": "You already have access to this course."},
                status=400
            )

        if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
            return Response(
                {"error": "Razorpay credentials are missing."},
                status=500
            )

        try:

            amount = int(
                (Decimal(str(course.price)) * 100).quantize(
                    Decimal("1"),
                    rounding=ROUND_HALF_UP
                )
            )

            if amount <= 0:
                return Response(
                    {"error": "Invalid course price."},
                    status=400
                )

            client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET
                )
            )

            order = client.order.create({
                "amount": amount,
                "currency": "INR",
                "receipt": f"enrollment_{enrollment.id}",
                "notes": {
                    "enrollment_id": str(enrollment.id),
                    "course_id": str(course.id),
                    "user_id": str(request.user.id)
                }
            })

            enrollment.razorpay_order_id = order["id"]
            enrollment.save(update_fields=["razorpay_order_id"])

            return Response({
                "key_id": settings.RAZORPAY_KEY_ID,
                "order_id": order["id"],
                "amount": amount,
                "currency": "INR",
                "enrollment_id": enrollment.id
            })

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=500
            )

class VerifyRazorpayPaymentView(APIView):

    authentication_classes = [ExpiringTokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

        enrollment_id = request.data.get("enrollment_id")
        order_id = request.data.get("razorpay_order_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")

        if not all([enrollment_id, order_id, payment_id, signature]):
            return Response(
                {"error": "Payment details are incomplete."},
                status=400
            )

        try:
            enrollment = Enrollment.objects.get(
                id=enrollment_id,
                user=request.user
            )
        except Enrollment.DoesNotExist:
            return Response(
                {"error": "Enrollment not found."},
                status=404
            )

        if enrollment.status == "paid":
            return Response({"status": "paid"})

        if enrollment.razorpay_order_id != order_id:
            return Response(
                {"error": "Invalid Razorpay order."},
                status=400
            )

        generated_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
            f"{order_id}|{payment_id}".encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(
            generated_signature,
            signature
        ):
            return Response(
                {"error": "Payment signature verification failed."},
                status=400
            )

        try:
            client = razorpay.Client(
                auth=(
                    settings.RAZORPAY_KEY_ID,
                    settings.RAZORPAY_KEY_SECRET
                )
            )

            payment = client.payment.fetch(payment_id)

            if payment.get("order_id") != order_id:
                return Response(
                    {"error": "Payment order mismatch."},
                    status=400
                )

            if payment.get("status") != "captured":
                return Response(
                    {"error": "Payment has not been captured yet."},
                    status=400
                )

            expected_amount = int(
                (Decimal(str(enrollment.course.price)) * 100).quantize(
                    Decimal("1"),
                    rounding=ROUND_HALF_UP
                )
            )

            if payment.get("amount") != expected_amount:
                return Response(
                    {"error": "Payment amount mismatch."},
                    status=400
                )

            enrollment.mark_paid()

            Notification.objects.create(
                user=request.user,
                title="Course access activated",
                message=(
                    f"Your access to {enrollment.course.name} "
                    "is now active."
                )
            )

            return Response({
                "status": "paid",
                "message": "Payment verified successfully."
            })

        except Exception:
            return Response(
                {"error": "Unable to verify payment with Razorpay."},
                status=500
            )            
