from django.contrib import admin
from .models import Enrollment, Notification, OnlineClass

admin.site.register(Enrollment)
admin.site.register(Notification)
admin.site.register(OnlineClass)
