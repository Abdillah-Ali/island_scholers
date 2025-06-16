from rest_framework import serializers
from .models import Event, EventRegistration, EventFeedback
from apps.users.serializers import OrganizationProfileSerializer

class EventSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.organization_profile.company_name', read_only=True)
    organization_logo = serializers.ImageField(source='organization.profile_image', read_only=True)
    current_participants = serializers.ReadOnlyField()
    is_registration_open = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organization', 'created_at', 'updated_at']

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        exclude = ['organization', 'created_at', 'updated_at']
    
    def validate(self, data):
        if data['end_date'] <= data['start_date']:
            raise serializers.ValidationError("End date must be after start date")
        
        if data['registration_deadline'] >= data['start_date']:
            raise serializers.ValidationError("Registration deadline must be before start date")
        
        return data
    
    def create(self, validated_data):
        validated_data['organization'] = self.context['request'].user
        return super().create(validated_data)

class EventDetailSerializer(serializers.ModelSerializer):
    organization = OrganizationProfileSerializer(source='organization.organization_profile', read_only=True)
    current_participants = serializers.ReadOnlyField()
    is_registration_open = serializers.ReadOnlyField()
    user_registration_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = '__all__'
    
    def get_user_registration_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'student':
            try:
                registration = EventRegistration.objects.get(event=obj, student=request.user)
                return registration.status
            except EventRegistration.DoesNotExist:
                return None
        return None

class EventRegistrationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    student_email = serializers.CharField(source='student.email', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = '__all__'
        read_only_fields = ['student', 'registered_at']

class EventRegistrationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = ['event', 'additional_info']
    
    def validate_event(self, value):
        if not value.is_registration_open:
            raise serializers.ValidationError("Registration is not open for this event")
        
        # Check if student already registered
        if EventRegistration.objects.filter(
            event=value, 
            student=self.context['request'].user
        ).exists():
            raise serializers.ValidationError("You are already registered for this event")
        
        return value
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        event = validated_data['event']
        
        # Check if event is full, add to waitlist
        if event.current_participants >= event.max_participants:
            validated_data['status'] = 'waitlist'
        else:
            validated_data['status'] = 'confirmed'
        
        return super().create(validated_data)

class EventFeedbackSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.get_full_name', read_only=True)
    
    class Meta:
        model = EventFeedback
        fields = '__all__'
        read_only_fields = ['student', 'submitted_at']

class EventFeedbackCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventFeedback
        fields = ['event', 'rating', 'comment', 'would_recommend']
    
    def validate_event(self, value):
        # Check if student attended the event
        try:
            registration = EventRegistration.objects.get(
                event=value, 
                student=self.context['request'].user,
                status='confirmed'
            )
        except EventRegistration.DoesNotExist:
            raise serializers.ValidationError("You must have attended this event to provide feedback")
        
        # Check if feedback already exists
        if EventFeedback.objects.filter(
            event=value, 
            student=self.context['request'].user
        ).exists():
            raise serializers.ValidationError("You have already provided feedback for this event")
        
        return value
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)