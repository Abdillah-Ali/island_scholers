from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, OrganizationProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'profile_image', 'phone_number', 'location', 'bio', 'is_verified', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'

class OrganizationProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = OrganizationProfile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 
                 'last_name', 'role', 'phone_number', 'location', 'bio']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile based on role
        if user.role == 'student':
            StudentProfile.objects.create(user=user)
        elif user.role == 'organization':
            OrganizationProfile.objects.create(user=user)
        
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_number', 'location', 'bio', 'profile_image']