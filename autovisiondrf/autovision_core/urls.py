from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect  # 👈 add this

urlpatterns = [
    path('', lambda request: redirect('/api/'), name='root'),  # 👈 add this
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]