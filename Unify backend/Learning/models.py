from django.conf import settings
from django.db import models
from django.utils import timezone
from MyApp.models import Course


class Enrollment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="course_enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    purchased_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    razorpay_order_id = models.CharField(
    max_length=100,
    blank=True,
    null=True
)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["user", "course"], name="unique_user_course_enrollment")
        ]

    @property
    def has_access(self):
        return self.status == "paid"

    def mark_paid(self):
        self.status = "paid"
        self.purchased_at = self.purchased_at or timezone.now()
        self.save(update_fields=["status", "purchased_at"])


class Notification(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="notifications", null=True, blank=True
    )
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class OnlineClass(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="online_classes")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_at = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=60)
    meeting_url = models.URLField(blank=True)
    recording_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_at"]

    @property
    def state(self):
        now = timezone.now()
        end = self.start_at + timezone.timedelta(minutes=self.duration_minutes)
        if now < self.start_at:
            return "upcoming"
        if now <= end:
            return "live"
        return "ended"
