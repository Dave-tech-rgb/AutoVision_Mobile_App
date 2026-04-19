from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Device(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="Online")
    device_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"


class DetectionLog(models.Model):
    type = models.CharField(max_length=100)
    confidence = models.FloatField()
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    device = models.ForeignKey(
        Device,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='detections'
    )

    def __str__(self):
        return f"{self.type} - {self.confidence}% at {self.date} {self.time}"


class UserProfile(models.Model):
    """
    Extends Django's built-in User model.
    The frontend derives roles from:
      - is_superuser  → Admin
      - is_staff      → Staff
      - neither       → Viewer
    This profile stores any extra fields you may need later.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    # Add extra fields here as your app grows, e.g.:
    # avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    # phone  = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"Profile({self.user.username})"

    # ── Convenience properties that mirror your React Native getRoleInfo() ──

    @property
    def role(self):
        if self.user.is_superuser:
            return 'admin'
        if self.user.is_staff:
            return 'staff'
        return 'viewer'

    @property
    def is_active(self):
        return self.user.is_active