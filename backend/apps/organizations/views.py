from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Avg, Count, Q
from apps.users.models import OrganizationProfile
from .models import OrganizationStats, OrganizationReview
from .serializers import (
    OrganizationDetailSerializer, OrganizationReviewSerializer, 
    OrganizationReviewCreateSerializer, OrganizationStatsSerializer
)

class OrganizationListView(generics.ListAPIView):
    queryset = OrganizationProfile.objects.select_related('user').all()
    serializer_class = OrganizationDetailSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['industry', 'company_size']
    search_fields = ['company_name', 'description', 'industry']
    ordering_fields = ['user__created_at', 'company_name']
    ordering = ['company_name']

class OrganizationDetailView(generics.RetrieveAPIView):
    queryset = OrganizationProfile.objects.select_related('user').all()
    serializer_class = OrganizationDetailSerializer
    permission_classes = [permissions.AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment profile views
        stats, created = OrganizationStats.objects.get_or_create(
            organization=instance.user
        )
        stats.profile_views += 1
        stats.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class OrganizationReviewCreateView(generics.CreateAPIView):
    queryset = OrganizationReview.objects.all()
    serializer_class = OrganizationReviewCreateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        if self.request.user.role != 'student':
            raise permissions.PermissionDenied("Only students can review organizations")
        serializer.save(student=self.request.user)

class OrganizationReviewsView(generics.ListAPIView):
    serializer_class = OrganizationReviewSerializer
    permission_classes = [permissions.AllowAny]
    ordering = ['-created_at']
    
    def get_queryset(self):
        organization_id = self.kwargs.get('organization_id')
        return OrganizationReview.objects.filter(
            organization_id=organization_id,
            is_verified=True
        ).select_related('student')

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def organization_statistics(request):
    """Get general statistics about organizations"""
    stats = {
        'total_organizations': OrganizationProfile.objects.count(),
        'organizations_by_industry': OrganizationProfile.objects.values('industry').annotate(
            count=Count('id')
        ).order_by('-count'),
        'top_rated_organizations': OrganizationProfile.objects.annotate(
            avg_rating=Avg('user__reviews__rating'),
            review_count=Count('user__reviews')
        ).filter(review_count__gte=3).order_by('-avg_rating')[:5],
        'most_active_organizations': OrganizationProfile.objects.annotate(
            internship_count=Count('user__internships'),
            event_count=Count('user__events')
        ).order_by('-internship_count', '-event_count')[:5]
    }
    
    # Serialize top rated organizations
    top_rated_serializer = OrganizationDetailSerializer(
        [org for org in stats['top_rated_organizations']], 
        many=True
    )
    stats['top_rated_organizations'] = top_rated_serializer.data
    
    # Serialize most active organizations
    most_active_serializer = OrganizationDetailSerializer(
        [org for org in stats['most_active_organizations']], 
        many=True
    )
    stats['most_active_organizations'] = most_active_serializer.data
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_organization_stats(request):
    """Get detailed statistics for the current organization"""
    if request.user.role != 'organization':
        return Response(
            {'error': 'Only organizations can view their statistics'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    stats, created = OrganizationStats.objects.get_or_create(
        organization=request.user
    )
    
    # Update stats
    stats.total_internships_posted = request.user.internships.count()
    stats.total_applications_received = sum(
        internship.applications.count() 
        for internship in request.user.internships.all()
    )
    stats.total_events_hosted = request.user.events.count()
    stats.save()
    
    # Additional analytics
    reviews = request.user.reviews.all()
    analytics = {
        'stats': OrganizationStatsSerializer(stats).data,
        'review_analytics': {
            'total_reviews': reviews.count(),
            'average_rating': reviews.aggregate(avg=Avg('rating'))['avg'] or 0,
            'rating_distribution': {
                str(i): reviews.filter(rating=i).count() 
                for i in range(1, 6)
            },
            'recommendation_rate': (
                reviews.filter(would_recommend=True).count() / reviews.count() * 100
                if reviews.exists() else 0
            )
        }
    }
    
    return Response(analytics)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def trending_organizations(request):
    """Get trending organizations based on recent activity"""
    from django.utils import timezone
    from datetime import timedelta
    
    # Organizations with recent activity (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    trending = OrganizationProfile.objects.annotate(
        recent_internships=Count(
            'user__internships',
            filter=Q(user__internships__created_at__gte=thirty_days_ago)
        ),
        recent_events=Count(
            'user__events',
            filter=Q(user__events__created_at__gte=thirty_days_ago)
        ),
        total_recent_activity=Count('user__internships') + Count('user__events')
    ).filter(
        total_recent_activity__gt=0
    ).order_by('-total_recent_activity')[:10]
    
    serializer = OrganizationDetailSerializer(trending, many=True)
    return Response(serializer.data)