from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('<int:pk>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('<int:pk>/delete/', views.delete_notification, name='delete-notification'),
    path('mark-all-read/', views.mark_all_notifications_read, name='mark-all-read'),
    path('unread-count/', views.unread_notification_count, name='unread-count'),
    path('preferences/', views.NotificationPreferenceView.as_view(), name='notification-preferences'),
]