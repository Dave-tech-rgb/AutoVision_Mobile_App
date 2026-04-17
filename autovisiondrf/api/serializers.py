# api/serializers.py
from rest_framework import serializers
from .models import Device, DetectionLog

class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'

class DetectionLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetectionLog
        fields = '__all__'