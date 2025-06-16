from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend
from .models import Internship, InternshipView
from .serializers import (
    InternshipSerializer, InternshipCreateSerializer, 
    InternshipDetailSerializer, InternshipViewSerializer
)
from .filters import InternshipFilter

class InternshipListView(generics.ListAPIView):
    queryset = Internship.objects.filter(is_active=True).select_related('organization__organization_profile')
    serializer_class = InternshipSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = InternshipFilter
    search_fields = ['title', 'description', 'location', 'skills_required']
    ordering_fields = ['created_at', 'application_deadline', 'stipend_amount']
    ordering = ['-created_at']

class InternshipDetailView(generics.RetrieveAPIView):
    queryset = Internship.objects.filter(is_active=True).select_related('organization__organization_profile')
    serializer_class = InternshipDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Track view
        if request.user.is_authenticated:
            InternshipView.objects.get_or_create(
                internship=instance,
                user=request.user,
                ip_address=self.get_client_ip(request),
                defaults={'ip_address': self.get_client_ip(request)}
            )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class InternshipCreateView(generics.CreateAPIView):
    queryset = Internship.objects.all()
    serializer_class = InternshipCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'organization':
            raise permissions.PermissionDenied("Only organizations can create internships")
        serializer.save(organization=self.request.user)

class InternshipUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = InternshipCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Internship.objects.filter(organization=self.request.user)

class InternshipDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Internship.objects.filter(organization=self.request.user)

class OrganizationInternshipsView(generics.ListAPIView):
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Internship.objects.filter(organization=self.request.user).order_by('-created_at')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recommended_internships(request):
    """Get recommended internships for students based on their skills"""
    if request.user.role != 'student':
        return Response({'error': 'Only students can get recommendations'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    try:
        student_profile = request.user.student_profile
        student_skills = student_profile.skills or []
        
        if not student_skills:
            # If no skills, return recent internships
            internships = Internship.objects.filter(is_active=True)[:10]
        else:
            # Find internships that match student skills
            internships = Internship.objects.filter(
                is_active=True,
                skills_required__overlap=student_skills
            ).annotate(
                skill_matches=Count('skills_required')
            ).order_by('-skill_matches', '-created_at')[:10]
        
        serializer = InternshipSerializer(internships, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def internship_analytics(request, pk):
    """Get analytics for a specific internship (organization only)"""
    try:
        internship = Internship.objects.get(pk=pk, organization=request.user)
        
        analytics = {
            'total_views': internship.views.count(),
            'unique_viewers': internship.views.values('user').distinct().count(),
            'applications_count': internship.applications.count(),
            'view_to_application_rate': 0
        }
        
        if analytics['total_views'] > 0:
            analytics['view_to_application_rate'] = (
                analytics['applications_count'] / analytics['total_views'] * 100
            )
        
        return Response(analytics)
    
    except Internship.DoesNotExist:
        return Response({'error': 'Internship not found'}, status=status.HTTP_404_NOT_FOUND)