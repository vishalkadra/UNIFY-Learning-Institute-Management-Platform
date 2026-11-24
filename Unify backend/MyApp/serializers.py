from django.contrib.auth import authenticate, password_validation
from rest_framework import serializers

from .models import EmailOTP, User ,Query,Course, CourseModule, Placement,Expert


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[password_validation.validate_password]
    )
    password2 = serializers.CharField(write_only=True, label="Confirm password")

    class Meta:
        model = User
        fields = ["email", "first_name", "last_name", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["email"],  # ModelBackend maps this onto USERNAME_FIELD
            password=attrs["password"],
        )
        if not user:
            raise serializers.ValidationError(
                "Invalid email or password.", code="authorization"
            )
        if not user.is_active:
            raise serializers.ValidationError(
                "This account is inactive.", code="authorization"
            )
        attrs["user"] = user
        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(
        write_only=True, validators=[password_validation.validate_password]
    )

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value


class RequestOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=EmailOTP.Purpose.choices)


class VerifyEmailOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(r"^\d{6}$", error_messages={"invalid": "Code must be 6 digits."})


class ResetPasswordWithOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.RegexField(r"^\d{6}$", error_messages={"invalid": "Code must be 6 digits."})
    new_password = serializers.CharField(
        write_only=True, validators=[password_validation.validate_password]
    )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "is_verified", "date_joined","is_staff","is_superuser"]
        read_only_fields = ["id", "is_verified", "date_joined","is_superuser", "is_staff"]


class QuerySerializer(serializers.ModelSerializer):        
    class Meta:
        model = Query
        fields = ["id", "type", "name", "email", "contact", "problem", "resolved", "created_at"]
        read_only_fields = ["email","created_at"]


class ManageUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "is_verified", "date_joined","is_staff","is_superuser"]
        read_only_fields = ["id", "email", "first_name", "last_name"]        


class CourseModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModule
        fields = [
            "id","title", "course","description"
        ]
    

class CourseSerializer(serializers.ModelSerializer):

    modules = CourseModuleSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = Course
        fields = [
            "id","name","description","duration","price","image","modules"
        ]
        read_only_fields = ["id"]

class PlacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Placement
        fields = ["id", "company_name", "date", "role", "location", "package", "eligibility","company_description"]
        read_only_fields = ["id"]

class ExpertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expert
        fields = ["id", "image", "name", "Qualification", "experience", "role", "skills", "expertise"]
        read_only_fields = ["id"]