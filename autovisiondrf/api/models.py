from django.db import models
from django.utils import timezone

class Device(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, default="Online")
    device_id = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.device_id})"

class DetectionLog(models.Model):
    type = models.CharField(max_length=100)  # e.g., Car, Person
    confidence = models.FloatField()
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now_add=True)
    device = models.ForeignKey(Device, on_delete=models.SET_NULL, null=True, blank=True, related_name='detections')

    def __str__(self):
        return f"{self.type} - {self.confidence}% at {self.date} {self.time}"
