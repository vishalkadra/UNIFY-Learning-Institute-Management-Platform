from rest_framework import serializers
from django.utils import timezone
from .models import Enrollment, Notification, OnlineClass


class EnrollmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="course.name", read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.SerializerMethodField()
    has_access = serializers.BooleanField(read_only=True)

    class Meta:
        model = Enrollment
        fields = ["id", "user_email","user_name", "course", "course_name", "status", "has_access", "purchased_at", "created_at"]
        read_only_fields = ["id", "status", "purchased_at", "created_at", "has_access"]

    def get_user_name(self, obj):
        name = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return name or obj.user.email    

    def create(self, validated_data):
        user = self.context["request"].user
        enrollment, _ = Enrollment.objects.get_or_create(user=user, course=validated_data["course"])
        return enrollment


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "user", "title", "message", "is_read", "created_at"]
        read_only_fields = ["id", "created_at", "is_read"]

    def validate_user(self, value):
        return value


class OnlineClassSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="course.name", read_only=True)
    state = serializers.CharField(read_only=True)

    class Meta:
        model = OnlineClass
        fields = [
            "id", "course", "course_name", "title", "description",
            "start_at", "duration_minutes", "meeting_url",
            "recording_url", "is_active", "state", "created_at"
        ]
        read_only_fields = ["id", "course_name", "state", "created_at"]
