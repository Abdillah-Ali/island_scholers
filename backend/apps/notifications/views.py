from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Notification, NotificationPreference
from .serializers import NotificationSerializer, NotificationPreferenceSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        preference, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return preference

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_notification_read(request, pk):
    """Mark a specific notification as read"""
    try:
        notification = Notification.objects.get(pk=pk, recipient=request.user)
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_all_notifications_read(request):
    """Mark all notifications as read for the current user"""
    Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
    return Response({'message': 'All notifications marked as read'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def unread_notification_count(request):
    """Get count of unread notifications"""
    count = Notification.objects.filter(recipient=request.user, is_read=False).count()
    return Response({'unread_count': count})

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_notification(request, pk):
    """Delete a specific notification"""
    try:
        notification = Notification.objects.get(pk=pk, recipient=request.user)
        notification.delete()
        return Response({'message': 'Notification deleted'})
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)