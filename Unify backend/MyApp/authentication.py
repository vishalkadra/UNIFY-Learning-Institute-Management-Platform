import secrets
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication
from rest_framework.authentication import get_authorization_header

from .models import AuthToken


TOKEN_TTL_HOURS = getattr(
    settings,
    "AUTH_TOKEN_TTL_HOURS",
    24,
)


def generate_token_key() -> str:
    """
    Generate a secure 64-character token.
    """
    return secrets.token_hex(32)


def issue_token(user, device_info: str = "") -> AuthToken:
    """
    Create and save a new authentication token.
    """
    return AuthToken.objects.create(
        key=generate_token_key(),
        user=user,
        expires_at=timezone.now()
        + timedelta(hours=TOKEN_TTL_HOURS),
        device_info=device_info[:255],
    )


class ExpiringTokenAuthentication(BaseAuthentication):
    """
    Authenticate using:

        Authorization: Bearer <token>

    On successful authentication:

        request.user -> User
        request.auth -> AuthToken
    """

    keyword = "Bearer"

    def authenticate(self, request):
        auth = get_authorization_header(request).split()

        # No Authorization header
        if not auth:
            return None

        # Wrong authentication scheme
        if auth[0].lower() != self.keyword.lower().encode():
            return None

        # "Bearer" without token
        if len(auth) == 1:
            raise exceptions.AuthenticationFailed(
                "Invalid token header. No credentials provided."
            )

        # More than one token part
        if len(auth) > 2:
            raise exceptions.AuthenticationFailed(
                "Invalid token header. Token string should not contain spaces."
            )

        try:
            token_key = auth[1].decode()
        except UnicodeDecodeError:
            raise exceptions.AuthenticationFailed(
                "Invalid token header. Token string contains invalid characters."
            )

        return self.authenticate_credentials(token_key)

    def authenticate_credentials(self, key):
        try:
            token = (
                AuthToken.objects
                .select_related("user")
                .get(key=key)
            )
        except AuthToken.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                "Invalid token."
            )

        # Check expiry
        if token.is_expired():
            token.delete()
            raise exceptions.AuthenticationFailed(
                "Token has expired."
            )

        # Check user
        if not token.user.is_active:
            raise exceptions.AuthenticationFailed(
                "User is inactive."
            )

        return token.user, token

    def authenticate_header(self, request):
        return self.keyword