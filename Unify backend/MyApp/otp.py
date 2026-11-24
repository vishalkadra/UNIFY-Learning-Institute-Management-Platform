"""
OTP generation, delivery, and verification.

Kept separate from authentication.py because it's a distinct concern:
authentication.py answers "who is this request from", this module answers
"has this user proven control of their inbox right now".
"""
import hashlib
import secrets
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from django.contrib.auth.hashers import make_password, check_password

from .models import EmailOTP, PendingRegistration, User

OTP_TTL_MINUTES = getattr(settings, "OTP_TTL_MINUTES", 10)
OTP_MAX_ATTEMPTS = getattr(settings, "OTP_MAX_ATTEMPTS", 5)
OTP_RESEND_COOLDOWN_SECONDS = getattr(settings, "OTP_RESEND_COOLDOWN_SECONDS", 60)


class OTPError(Exception):
    """Raised for any invalid, expired, exhausted, or rate-limited OTP request.
    Views catch this and turn it into a 400/429 response."""


def _generate_code() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"  # 000000-999999, zero-padded


def _hash_code(code: str) -> str:
    # SECRET_KEY acts as a pepper so a DB dump alone isn't enough to
    # precompute a lookup table of code -> hash.
    return hashlib.sha256(f"{code}{settings.SECRET_KEY}".encode()).hexdigest()


def _send_email(user, code: str, purpose: str) -> None:
    subject = {
        EmailOTP.Purpose.VERIFY_EMAIL: "Verify your email",
        EmailOTP.Purpose.PASSWORD_RESET: "Reset your password",
    }[purpose]
    message = (
        f"Your verification code is {code}\n\n"
        f"It expires in {OTP_TTL_MINUTES} minutes and can only be used once. "
        "If you didn't request this, you can safely ignore this email."
    )
    send_mail(
        subject=subject,
        message=message,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "vishalkadra693@gmail.com"),
        recipient_list=[user.email],
        fail_silently=False,
    )


def request_otp(user, purpose: str) -> EmailOTP:
    """Create a fresh code and email it. Raises OTPError if called again
    too soon (resend cooldown)."""
    cooldown_start = timezone.now() - timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS)
    recent = EmailOTP.objects.filter(
        user=user, purpose=purpose, created_at__gte=cooldown_start
    ).first()
    if recent:
        wait = OTP_RESEND_COOLDOWN_SECONDS - int(
            (timezone.now() - recent.created_at).total_seconds()
        )
        raise OTPError(f"Please wait {max(wait, 1)}s before requesting another code.")

    # Only the newest code for a given purpose should ever work.
    EmailOTP.objects.filter(user=user, purpose=purpose, is_used=False).update(is_used=True)

    code = _generate_code()
    otp = EmailOTP.objects.create(
        user=user,
        purpose=purpose,
        code_hash=_hash_code(code),
        expires_at=timezone.now() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    _send_email(user, code, purpose)
    return otp


def verify_otp(user, code: str, purpose: str) -> EmailOTP:
    """Validate a submitted code. Raises OTPError with a user-facing message
    on any failure; wrong-code attempts count against OTP_MAX_ATTEMPTS."""
    otp = EmailOTP.objects.filter(user=user, purpose=purpose, is_used=False).first()
    if not otp:
        raise OTPError("No active code for this request. Ask for a new one.")
    if otp.is_expired():
        raise OTPError("This code has expired. Ask for a new one.")
    if otp.attempts >= OTP_MAX_ATTEMPTS:
        raise OTPError("Too many incorrect attempts. Ask for a new one.")

    if _hash_code(code) != otp.code_hash:
        otp.attempts += 1
        otp.save(update_fields=["attempts"])
        raise OTPError("Incorrect code.")

    otp.is_used = True
    otp.save(update_fields=["is_used"])
    return otp


def request_registration_otp(pending: PendingRegistration, first_name: str, last_name: str, password: str) -> None:
    """Store registration details as pending and email a one-time code."""
    cooldown_start = timezone.now() - timedelta(seconds=OTP_RESEND_COOLDOWN_SECONDS)
    if pending.pk and pending.code_hash != "pending" and pending.created_at >= cooldown_start and not pending.is_used:
        wait = OTP_RESEND_COOLDOWN_SECONDS - int((timezone.now() - pending.created_at).total_seconds())
        raise OTPError(f"Please wait {max(wait, 1)}s before requesting another code.")

    code = _generate_code()
    pending.first_name = first_name
    pending.last_name = last_name
    pending.password_hash = make_password(password)
    pending.code_hash = _hash_code(code)
    pending.created_at = timezone.now()
    pending.expires_at = timezone.now() + timedelta(minutes=OTP_TTL_MINUTES)
    pending.attempts = 0
    pending.is_used = False
    pending.save()

    message = (
        f"Your Unify registration verification code is {code}\n\n"
        f"It expires in {OTP_TTL_MINUTES} minutes and can only be used once. "
        "If you didn't request this, you can safely ignore this email."
    )
    send_mail(
        subject="Verify your Unify account",
        message=message,
        from_email=getattr(settings, "DEFAULT_FROM_EMAIL", "vishalkadra693@gmail.com"),
        recipient_list=[pending.email],
        fail_silently=False,
    )


def verify_registration_otp(pending: PendingRegistration, code: str) -> User:
    """Verify pending signup and only then create the real User row."""
    if pending.is_used:
        raise OTPError("This code has already been used. Please register again.")
    if pending.is_expired():
        raise OTPError("This code has expired. Please register again to get a new code.")
    if pending.attempts >= OTP_MAX_ATTEMPTS:
        raise OTPError("Too many incorrect attempts. Please register again to get a new code.")
    if _hash_code(code) != pending.code_hash:
        pending.attempts += 1
        pending.save(update_fields=["attempts"])
        raise OTPError("Incorrect code.")

    if User.objects.filter(email__iexact=pending.email).exists():
        raise OTPError("An account with this email already exists. Please log in.")

    user = User(
        email=pending.email,
        first_name=pending.first_name,
        last_name=pending.last_name,
        is_verified=True,
    )
    # Keep the already Django-hashed password; never store plaintext in pending data.
    user.password = pending.password_hash
    user.save()
    pending.is_used = True
    pending.save(update_fields=["is_used"])
    pending.delete()
    return user
