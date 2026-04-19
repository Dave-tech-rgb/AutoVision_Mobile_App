from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, filters, permissions
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny

from django.contrib.auth.models import User

from .models import Device, DetectionLog
from .serializers import DeviceSerializer, DetectionLogSerializer, UserSerializer


# ─── Device ViewSet ───────────────────────────────────────────────
class DeviceViewSet(viewsets.ModelViewSet):
    queryset = Device.objects.all().order_by('-created_at')
    serializer_class = DeviceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'location']


# ─── Detection Log ViewSet ────────────────────────────────────────
class DetectionLogViewSet(viewsets.ModelViewSet):
    queryset = DetectionLog.objects.all().order_by('-date', '-time')
    serializer_class = DetectionLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['label']

    def get_queryset(self):
        queryset = DetectionLog.objects.all().order_by('-date', '-time')
        # Filter by vehicles_detected query param
        detected = self.request.query_params.get('vehicles_detected')
        if detected is not None:
            if detected.lower() == 'true':
                queryset = queryset.filter(vehicles_detected=True)
            elif detected.lower() == 'false':
                queryset = queryset.filter(vehicles_detected=False)
        return queryset


# ─── User ViewSet ─────────────────────────────────────────────────
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    def get_permissions(self):
        # Only superusers can create/update/delete
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAdminUser()]   # create, update, destroy require admin

    @action(detail=True, methods=['post'], url_path='toggle-active')
    def toggle_active(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({'id': user.id, 'is_active': user.is_active})

# ─── Public Registration ──────────────────────────────────────────
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        email    = request.data.get('email', '').strip()

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {'password': ['Password must be at least 6 characters.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'username': ['Username already taken.']},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            password=password,
            email=email,
        )

        return Response(
            {'message': 'Account created successfully.', 'username': user.username},
            status=status.HTTP_201_CREATED
        )


# ─── Vehicle Detection ────────────────────────────────────────────
class VehicleDetectionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        image_data = request.data.get('image')

        if not image_data:
            return Response(
                {'error': 'No image provided.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ── Plug in your actual model here ──────────────────────
        # Example with YOLO or any model:
        # result = your_model.detect(image_data)
        # ────────────────────────────────────────────────────────

        # Placeholder result
        result = {
            'vehicles_detected': True,
            'count': 2,
            'labels': ['car', 'motorcycle'],
            'confidence': 0.95,
        }

        # Auto-save to DetectionLog
        DetectionLog.objects.create(
            vehicles_detected=result['vehicles_detected'],
            count=result['count'],
            label=', '.join(result.get('labels', [])),
            confidence=result['confidence'],
        )

        return Response(result, status=status.HTTP_200_OK)