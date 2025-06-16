from rest_framework import serializers
from django.db.models import Avg, Count
from apps.users.models import OrganizationProfile
from apps.users.serializers import OrganizationProfileSerializer
from .models import OrganizationStats, OrganizationReview

class OrganizationStatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationStats
        fields = '__all__'

class OrganizationReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    
    class Meta:
        model = OrganizationReview
        fields = '__all__'
        read_only_fields = ['student', 'created_at', 'is_verified']

class OrganizationReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationReview
        fields = ['organization', 'rating', 'review_text', 'internship_experience', 'would_recommend']
    
    def validate_organization(self, value):
        # Check if student already reviewed this organization
        if OrganizationReview.objects.filter(
            organization=value, 
            student=self.context['request'].user
        ).exists():
            raise serializers.ValidationError("You have already reviewed this organization")
        
        return value
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

class OrganizationDetailSerializer(OrganizationProfileSerializer):
    stats = OrganizationStatsSerializer(source='user.stats', read_only=True)
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    
    class Meta(OrganizationProfileSerializer.Meta):
        fields = OrganizationProfileSerializer.Meta.fields + [
            'stats', 'average_rating', 'total_reviews', 'recent_reviews'
        ]
    
    def get_average_rating(self, obj):
        avg = obj.user.reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
        return round(avg, 1) if avg else 0
    
    def get_total_reviews(self, obj):
        return obj.user.reviews.count()
    
    def get_recent_reviews(self, obj):
        recent_reviews = obj.user.reviews.select_related('student')[:3]
        return OrganizationReviewSerializer(recent_reviews, many=True).data