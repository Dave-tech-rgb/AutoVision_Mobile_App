from django.contrib import admin
from .models import Device, DetectionLog

@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'status', 'device_id', 'created_at')
    search_fields = ('name', 'location', 'device_id')
    list_filter = ('status',)

@admin.register(DetectionLog)
class DetectionLogAdmin(admin.ModelAdmin):
    list_display = ('type', 'confidence', 'date', 'time', 'device')
    search_fields = ('type', 'device__name')
    list_filter = ('type', 'date')
