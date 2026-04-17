import os
import django
import sys
from django.test.client import Client

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "autovision_core.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Superuser 'admin' created with password 'admin'")
else:
    print("Superuser 'admin' already exists")

client = Client()

# Test 1: Obtain Token
response = client.post('/api/token/', {'username': 'admin', 'password': 'admin'})
if response.status_code == 200:
    print("✅ Successfully obtained JWT token")
    token = response.json().get('access')
else:
    print(f"❌ Failed to obtain token: {response.status_code}")
    print(response.content.decode()[:500])
    sys.exit(1)

# Test 2: Create a Device
import uuid
random_cam_id = f'cam-{uuid.uuid4().hex[:6]}'
headers = {'HTTP_AUTHORIZATION': f'Bearer {token}'}
response = client.post('/api/devices/', {
    'name': 'Camera 1',
    'location': 'Front Gate',
    'status': 'Online',
    'device_id': random_cam_id
}, **headers)

if response.status_code == 201:
    print("✅ Successfully created Device")
    device_id = response.json().get('id')
else:
    print(f"❌ Failed to create Device: {response.status_code} {response.content}")
    sys.exit(1)

# Test 3: Fetch Devices
response = client.get('/api/devices/', **headers)
if response.status_code == 200:
    print("✅ Successfully fetched Devices:", response.json())
else:
    print(f"❌ Failed to fetch Devices: {response.status_code}")
    sys.exit(1)

# Test 4: Create a DetectionLog
response = client.post('/api/detections/', {
    'type': 'Car',
    'confidence': 95.5,
    'device': device_id
}, **headers)

if response.status_code == 201:
    print("✅ Successfully created DetectionLog")
else:
    print(f"❌ Failed to create DetectionLog: {response.status_code} {response.content}")
    sys.exit(1)

# Test 5: Fetch DetectionLogs (No Auth needed due to IsAuthenticatedOrReadOnly)
response = client.get('/api/detections/')
if response.status_code == 200:
    print("✅ Successfully fetched DetectionLogs:", response.json())
else:
    print(f"❌ Failed to fetch DetectionLogs: {response.status_code}")
    sys.exit(1)

print("All API tests passed! ✨")
