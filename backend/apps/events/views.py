from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, EventRegistration, EventFeedback
from .serializers import (
    EventSerializer, EventCreateSerializer, EventDetailSerializer,
    EventRegistrationSerializer, EventRegistrationCreateSerializer,
    EventFeedbackSerializer, EventFeedbackCreateSerializer
)
from .filters import EventFilter

class EventListView(generics.ListAPIView):
    queryset = Event.objects.filter(status='active').select_related('organization__organization_profile')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = EventFilter
    search_fields = ['title', 'description', 'location', 'tags']
    ordering_fields = ['start_date', 'created_at', 'registration_deadline']
    ordering = ['start_date']

class EventDetailView(generics.RetrieveAPIView):
    queryset = Event.objects.filter(status='active').select_related('organization__organization_profile')
    serializer_class = EventDetailSerializer
    permission_classes = [permissions.AllowAny]

class EventCreateView(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'organization':
            raise permissions.PermissionDenied("Only organizations can create events")
        serializer.save(organization=self.request.user)

class EventUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = EventCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(organization=self.request.user)

class EventDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(organization=self.request.user)

class OrganizationEventsView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Event.objects.filter(organization=self.request.user).order_by('-created_at')

class EventRegistrationView(generics.CreateAPIView):
    queryset = EventRegistration.objects.all()
    serializer_class = EventRegistrationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'student':
            raise permissions.PermissionDenied("Only students can register for events")
        serializer.save(student=self.request.user)

class StudentEventRegistrationsView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'student':
            return EventRegistration.objects.none()
        return EventRegistration.objects.filter(student=self.request.user).select_related('event')

class EventParticipantsView(generics.ListAPIView):
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status']
    search_fields = ['student__first_name', 'student__last_name', 'student__email']
    
    def get_queryset(self):
        if self.request.user.role != 'organization':
            return EventRegistration.objects.none()
        
        event_id = self.kwargs.get('event_id')
        return EventRegistration.objects.filter(
            event_id=event_id,
            event__organization=self.request.user
        ).select_related('student')

class EventFeedbackCreateView(generics.CreateAPIView):
    queryset = EventFeedback.objects.all()
    serializer_class = EventFeedbackCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'student':
            raise permissions.PermissionDenied("Only students can provide feedback")
        serializer.save(student=self.request.user)

class EventFeedbackListView(generics.ListAPIView):
    serializer_class = EventFeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'organization':
            return EventFeedback.objects.none()
        
        event_id = self.kwargs.get('event_id')
        return EventFeedback.objects.filter(
            event_id=event_id,
            event__organization=self.request.user
        ).select_related('student')

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def cancel_event_registration(request, registration_id):
    """Allow students to cancel their event registration"""
    try:
        registration = EventRegistration.objects.get(
            id=registration_id,
            student=request.user,
            status__in=['pending', 'confirmed', 'waitlist']
        )
        
        registration.status = 'cancelled'
        registration.save()
        
        # If someone was on waitlist, move them to confirmed
        if registration.status == 'confirmed':
            waitlist_registration = EventRegistration.objects.filter(
                event=registration.event,
                status='waitlist'
            ).first()
            
            if waitlist_registration:
                waitlist_registration.status = 'confirmed'
                waitlist_registration.save()
        
        return Response({'message': 'Registration cancelled successfully'})
    
    except EventRegistration.DoesNotExist:
        return Response(
            {'error': 'Registration not found or cannot be cancelled'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def event_analytics(request, event_id):
    """Get analytics for a specific event (organization only)"""
    try:
        event = Event.objects.get(id=event_id, organization=request.user)
        
        registrations = event.registrations.all()
        feedback = event.feedback.all()
        
        analytics = {
            'total_registrations': registrations.count(),
            'confirmed_participants': registrations.filter(status='confirmed').count(),
            'waitlist_count': registrations.filter(status='waitlist').count(),
            'cancelled_count': registrations.filter(status='cancelled').count(),
            'feedback_count': feedback.count(),
            'average_rating': feedback.aggregate(avg_rating=Avg('rating'))['avg_rating'] or 0,
            'recommendation_rate': 0
        }
        
        if feedback.exists():
            analytics['recommendation_rate'] = (
                feedback.filter(would_recommend=True).count() / feedback.count() * 100
            )
        
        return Response(analytics)
    
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def upcoming_events(request):
    """Get upcoming events for landing page"""
    from django.utils import timezone
    
    events = Event.objects.filter(
        status='active',
        start_date__gt=timezone.now()
    ).order_by('start_date')[:6]
    
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)