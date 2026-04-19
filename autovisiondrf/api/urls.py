from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from api.views import (
    DeviceViewSet,
    DetectionLogViewSet,
    UserViewSet,
    VehicleDetectionView,
    RegisterView,
)

router = DefaultRouter()
router.register(r'devices',    DeviceViewSet,       basename='device')
router.register(r'detections', DetectionLogViewSet, basename='detection')
router.register(r'users',      UserViewSet,         basename='user')

urlpatterns = [
    path('',               include(router.urls)),
    path('token/',         TokenObtainPairView.as_view(),  name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),
    path('detect/',        VehicleDetectionView.as_view(), name='vehicle-detect'),
    path('register/',      RegisterView.as_view(),         name='register'),
]