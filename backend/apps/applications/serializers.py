from rest_framework import serializers
from .models import Application, ApplicationStatusHistory
from apps.internships.serializers import InternshipSerializer
from apps.users.serializers import StudentProfileSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    internship_title = serializers.CharField(source='internship.title', read_only=True)
    organization_name = serializers.CharField(source='internship.organization.organization_profile.company_name', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['student', 'applied_at', 'reviewed_at']

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['internship', 'cover_letter', 'resume', 'portfolio_url', 
                 'availability', 'preferred_start_date']
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)
    
    def validate_internship(self, value):
        # Check if application deadline has passed
        if value.is_deadline_passed:
            raise serializers.ValidationError("Application deadline has passed")
        
        # Check if student already applied
        if Application.objects.filter(
            student=self.context['request'].user, 
            internship=value
        ).exists():
            raise serializers.ValidationError("You have already applied for this internship")
        
        return value

class ApplicationDetailSerializer(serializers.ModelSerializer):
    student = StudentProfileSerializer(source='student.student_profile', read_only=True)
    internship = InternshipSerializer(read_only=True)
    status_history = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = '__all__'
    
    def get_status_history(self, obj):
        history = obj.status_history.all()[:5]  # Last 5 status changes
        return ApplicationStatusHistorySerializer(history, many=True).data

class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    notes = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = Application
        fields = ['status', 'reviewer_notes']
    
    def update(self, instance, validated_data):
        old_status = instance.status
        new_status = validated_data.get('status', instance.status)
        
        # Create status history entry
        if old_status != new_status:
            ApplicationStatusHistory.objects.create(
                application=instance,
                old_status=old_status,
                new_status=new_status,
                changed_by=self.context['request'].user,
                notes=validated_data.get('notes', '')
            )
        
        return super().update(instance, validated_data)

class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = ApplicationStatusHistory
        fields = '__all__'