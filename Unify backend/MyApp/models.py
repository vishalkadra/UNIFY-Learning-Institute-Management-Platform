import uuid

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that logs in with email instead of username."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(
        default=False, help_text=_("Set True once the user confirms their email.")
    )
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]  # email + password are already required by BaseUserManager

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

    def get_short_name(self):
        return self.first_name or self.email


class AuthToken(models.Model):
    """
    Custom auth token, deliberately separate from DRF's built-in
    rest_framework.authtoken.Token so it can carry an expiry and
    support multiple simultaneous sessions (one row per device/login).
    """

    key = models.CharField(max_length=64, primary_key=True)
    user = models.ForeignKey(
        User, related_name="auth_tokens", on_delete=models.CASCADE
    )
    created = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    device_info = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-created"]

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"Token({self.key[:8]}...) for {self.user.email}"


class EmailOTP(models.Model):
    """
    A one-time code emailed to the user, used for both email verification
    and OTP-based password reset. The code itself is never stored — only
    its hash — so a DB read can't reveal an active code.
    """

    class Purpose(models.TextChoices):
        VERIFY_EMAIL = "verify_email", "Verify email"
        PASSWORD_RESET = "password_reset", "Password reset"

    user = models.ForeignKey(User, related_name="otps", on_delete=models.CASCADE)
    purpose = models.CharField(max_length=20, choices=Purpose.choices)
    code_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    is_used = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=["user", "purpose", "is_used"])]
        ordering = ["-created_at"]

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"{self.get_purpose_display()} OTP for {self.user.email}"



class PendingRegistration(models.Model):
    """Registration data kept until the email OTP is successfully verified."""
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    password_hash = models.CharField(max_length=128)
    code_hash = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()
    attempts = models.PositiveSmallIntegerField(default=0)
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return f"Pending registration for {self.email}"


class Query(models.Model):
    """
    Model to store user queries.
    """
    TYPE_CHOICES = [
        ("placement", "Placement"),
        ("trainer", "Trainer"),
        ("management", "Management"),
        ("hardware", "Hardware"),
        ("class", "Class/course"),

   ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    contact= models.CharField(max_length=30)
    problem = models.TextField()
    resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["resolved","-created_at"]

    def __str__(self):
        return f"Query by {self.type} at {self.name}"


class Course(models.Model):
    """
    Model to store courses.
    """
    name = models.CharField(max_length=150)
    description = models.TextField()
    duration = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    image = models.ImageField(upload_to='courses/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

class CourseModule(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="modules"
    )
    title = models.TextField()
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.course.name} - {self.title}"  

class Expert(models.Model):
    """
    Model to store experts.
    """
    image = models.ImageField(upload_to='experts/', blank=True, null=True)
    name = models.CharField(max_length=150)
    Qualification = models.CharField(max_length=200)
    role = models.CharField(max_length=150)
    experience = models.CharField(max_length=100)
    skills = models.TextField()
    expertise = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

class Placement(models.Model):
    """
    Model to store placement drives.
    """
    company_name = models.CharField(max_length=150)
    date = models.DateField()
    location = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(max_length=150)
    package = models.CharField(max_length=150)
    eligibility= models.CharField(max_length=150)
    company_description = models.TextField()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.company_name