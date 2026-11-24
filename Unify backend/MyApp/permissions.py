from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission: anyone can read, only the owner can write.
    Assumes the model instance has a `user` (or `user_id`) attribute."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        owner_id = getattr(obj, "user_id", None) or getattr(getattr(obj, "user", None), "id", None)
        return owner_id == request.user.id


class IsVerified(permissions.BasePermission):
    """Gate an endpoint behind email/account verification."""

    message = "Your account is not verified yet."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_verified
        )


class IsAdminOrSelf(permissions.BasePermission):
    """Staff can access any user object; regular users only their own."""

    def has_object_permission(self, request, view, obj):
        return bool(request.user.is_staff or obj == request.user)


class IsStaffOrSuperuserOnly(permissions.BasePermission):
    """Allow only staff or superusers to access the view."""

    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))

class IsSuperuserOnly(permissions.BasePermission):
     """Allow only superusers to access the view."""

     def has_permission(self, request, view):
         return (request.user and request.user.is_authenticated and request.user.is_superuser)


class CanSubmitComplaint(permissions.BasePermission):
     """Only logged-in, regular (non-staff, non-superuser) users can file a complaint."""

     message="You must be logfed in as a student to submit a complaint. Staff and admin accounts cannot submit complaints."

     def has_permission(self, request, view):
         user=request.user
         return bool(
             user
             and user.is_authenticated
             and not user.is_staff
             and not user.is_superuser
         )

class IsSuperuserOnly(permissions.BasePermission):
    """Allow only superusers to access the view."""

    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and request.user.is_superuser)