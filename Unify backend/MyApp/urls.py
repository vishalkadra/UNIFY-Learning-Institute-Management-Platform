from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    ChangePasswordView,
    LoginView,
    LogoutAllView,
    LogoutView,
    MeView,
    RegisterView,
    RequestOTPView,
    ResetPasswordWithOTPView,
    VerifyEmailOTPView,
    QueryViewSet,
    AdminStatsView,
    ManageUserView,
    CourseViewSet,
    CourseModuleViewSet,
    PlacementViewSet,
    ExpertViewSet
    
)

# app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("logout-all/", LogoutAllView.as_view(), name="logout-all"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("otp/send/", RequestOTPView.as_view(), name="otp-send"),
    path("otp/verify/", VerifyEmailOTPView.as_view(), name="otp-verify"),
    path("otp/reset-password/", ResetPasswordWithOTPView.as_view(), name="otp-reset-password"),
    path("queries/", QueryViewSet.as_view({"get": "list", "post": "create"}), name="query-list-create"),
    path("queries/<int:pk>/", QueryViewSet.as_view({"get": "retrieve", "put": "update", "delete": "destroy","patch": "partial_update",}), name="query-detail"),
    path("dashboard/stats/",AdminStatsView.as_view(),name="admin-stats"),
    path("users/", ManageUserView.as_view(), name="manage-users"),
    path("users/<uuid:user_id>/", ManageUserView.as_view(), name="manage-user-detail"),    
    path("courses/", CourseViewSet.as_view({"get": "list", "post": "create"}), name="course-list-create"),
    path(
    "courses/<int:pk>/",
    CourseViewSet.as_view({
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }),
    name="course-detail"
),
    # ================= COURSE MODULES =================

path("course-modules/",CourseModuleViewSet.as_view({"get": "list","post": "create",}),name="course-module-list-create"),

path("course-modules/<int:pk>/",CourseModuleViewSet.as_view({"get": "retrieve","put": "update","patch": "partial_update","delete": "destroy",}),name="course-module-detail"),


path("placements/", PlacementViewSet.as_view({
    "get": "list",
    "post": "create"
}), name="placement-list-create"),

path("placements/<int:pk>/", PlacementViewSet.as_view({
    "get": "retrieve",
    "patch": "partial_update",
    "put": "update",
    "delete": "destroy"
}), name="placement-detail"),
path(
    "experts/",
    ExpertViewSet.as_view({
        "get": "list",
        "post": "create",
    }),
    name="expert-list-create",
),

path(
    "experts/<int:pk>/",
    ExpertViewSet.as_view({
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy",
    }),
    name="expert-detail",
),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
    
