from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q
from django.utils import timezone
from .models import Application, ApplicationStatusHistory
from .serializers import (
    ApplicationSerializer, ApplicationCreateSerializer, 
    ApplicationDetailSerializer, ApplicationStatusUpdateSerializer
)

class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'student':
            raise permissions.PermissionDenied("Only students can apply for internships")
        serializer.save(student=self.request.user)

class StudentApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'student':
            return Application.objects.none()
        return Application.objects.filter(student=self.request.user).select_related(
            'internship', 'internship__organization__organization_profile'
        )

class OrganizationApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['status', 'internship']
    search_fields = ['student__first_name', 'student__last_name', 'student__email']
    ordering_fields = ['applied_at', 'status']
    ordering = ['-applied_at']
    
    def get_queryset(self):
        if self.request.user.role != 'organization':
            return Application.objects.none()
        return Application.objects.filter(
            internship__organization=self.request.user
        ).select_related('student', 'internship')

class ApplicationDetailView(generics.RetrieveAPIView):
    serializer_class = ApplicationDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'student':
            return Application.objects.filter(student=user)
        elif user.role == 'organization':
            return Application.objects.filter(internship__organization=user)
        return Application.objects.none()

class ApplicationStatusUpdateView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'organization':
            return Application.objects.none()
        return Application.objects.filter(internship__organization=self.request.user)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status in ['accepted', 'rejected']:
            instance.reviewed_at = timezone.now()
            instance.save()

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def withdraw_application(request, pk):
    """Allow students to withdraw their applications"""
    try:
        application = Application.objects.get(
            pk=pk, 
            student=request.user,
            status__in=['pending', 'under_review']
        )
        
        old_status = application.status
        application.status = 'withdrawn'
        application.save()
        
        # Create status history
        ApplicationStatusHistory.objects.create(
            application=application,
            old_status=old_status,
            new_status='withdrawn',
            changed_by=request.user,
            notes='Application withdrawn by student'
        )
        
        return Response({'message': 'Application withdrawn successfully'})
    
    except Application.DoesNotExist:
        return Response(
            {'error': 'Application not found or cannot be withdrawn'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def application_statistics(request):
    """Get application statistics for organizations"""
    if request.user.role != 'organization':
        return Response(
            {'error': 'Only organizations can view statistics'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    applications = Application.objects.filter(internship__organization=request.user)
    
    stats = {
        'total_applications': applications.count(),
        'pending': applications.filter(status='pending').count(),
        'under_review': applications.filter(status='under_review').count(),
        'accepted': applications.filter(status='accepted').count(),
        'rejected': applications.filter(status='rejected').count(),
        'withdrawn': applications.filter(status='withdrawn').count(),
    }
    
    return Response(stats)