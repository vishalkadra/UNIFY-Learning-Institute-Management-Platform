from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    EnrollmentViewSet,
    NotificationViewSet,
    OnlineClassViewSet,
    LearningStatsView,
    StudentLearningSummaryView,
    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView,
)

router = DefaultRouter()

router.register(
    "enrollments",
    EnrollmentViewSet,
    basename="enrollment"
)

router.register(
    "notifications",
    NotificationViewSet,
    basename="notification"
)

router.register(
    "classes",
    OnlineClassViewSet,
    basename="online-class"
)

urlpatterns = [
    path("", include(router.urls)),

    path(
        "payments/create-order/",
        CreateRazorpayOrderView.as_view(),
        name="create-razorpay-order"
    ),

    path(
        "payments/verify/",
        VerifyRazorpayPaymentView.as_view(),
        name="verify-razorpay-payment"
    ),

    path("stats/", LearningStatsView.as_view()),
    path("summary/", StudentLearningSummaryView.as_view()),
]