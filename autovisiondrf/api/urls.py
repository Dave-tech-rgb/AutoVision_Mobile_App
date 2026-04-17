from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import DeviceViewSet, DetectionLogViewSet, VehicleDetectionView

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')
router.register(r'detections', DetectionLogViewSet, basename='detection')

urlpatterns = [
    *router.urls,
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('detect/', VehicleDetectionView.as_view(), name='vehicle-detect'),
]