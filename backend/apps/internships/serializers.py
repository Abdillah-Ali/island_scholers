from rest_framework import serializers
from .models import Internship, InternshipView
from apps.users.serializers import OrganizationProfileSerializer

class InternshipSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.organization_profile.company_name', read_only=True)
    organization_logo = serializers.ImageField(source='organization.profile_image', read_only=True)
    applications_count = serializers.ReadOnlyField()
    is_deadline_passed = serializers.ReadOnlyField()
    
    class Meta:
        model = Internship
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']

class InternshipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Internship
        exclude = ['organization', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['organization'] = self.context['request'].user
        return super().create(validated_data)

class InternshipDetailSerializer(serializers.ModelSerializer):
    organization = OrganizationProfileSerializer(source='organization.organization_profile', read_only=True)
    applications_count = serializers.ReadOnlyField()
    is_deadline_passed = serializers.ReadOnlyField()
    
    class Meta:
        model = Internship
        fields = '__all__'

class InternshipViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipView
        fields = '__all__'
        read_only_fields = ['user', 'viewed_at']