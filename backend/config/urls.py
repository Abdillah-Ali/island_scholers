"""
URL configuration for Island Scholars project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/organizations/', include('apps.organizations.urls')),
    path('api/internships/', include('apps.internships.urls')),
    path('api/applications/', include('apps.applications.urls')),
    path('api/events/', include('apps.events.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)