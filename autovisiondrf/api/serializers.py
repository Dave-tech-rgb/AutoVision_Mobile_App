from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Device, DetectionLog


# ─── Device ───────────────────────────────────────────────────────
class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


# ─── Detection Log ────────────────────────────────────────────────
class DetectionLogSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)

    class Meta:
        model = DetectionLog
        fields = '__all__'


# ─── User ─────────────────────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        min_length=6,          # ← matches your RegisterView validation
        error_messages={'min_length': 'Password must be at least 6 characters.'}
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'is_superuser', 'is_staff', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

    def validate(self, attrs):
        # Password required on create
        if not self.instance and not attrs.get('password'):
            raise serializers.ValidationError({'password': 'Password is required.'})
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance