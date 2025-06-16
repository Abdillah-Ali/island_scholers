from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import StudentProfile, OrganizationProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, OrganizationProfileSerializer,
    UserRegistrationSerializer, UserUpdateSerializer
)

User = get_user_model()

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile

class OrganizationProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = OrganizationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = OrganizationProfile.objects.get_or_create(user=self.request.user)
        return profile

class StudentListView(generics.ListAPIView):
    queryset = StudentProfile.objects.select_related('user').all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['university', 'field_of_study', 'year_of_study']
    search_fields = ['user__first_name', 'user__last_name', 'university', 'field_of_study']
    ordering_fields = ['user__created_at', 'gpa']

class OrganizationListView(generics.ListAPIView):
    queryset = OrganizationProfile.objects.select_related('user').all()
    serializer_class = OrganizationProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['industry', 'company_size']
    search_fields = ['company_name', 'industry', 'description']
    ordering_fields = ['user__created_at', 'company_name']

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_document(request):
    """Upload CV or university letter for students"""
    if request.user.role != 'student':
        return Response({'error': 'Only students can upload documents'}, 
                       status=status.HTTP_403_FORBIDDEN)
    
    profile = StudentProfile.objects.get(user=request.user)
    document_type = request.data.get('type')
    file = request.FILES.get('file')
    
    if not file:
        return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    if document_type == 'cv':
        profile.cv = file
    elif document_type == 'university_letter':
        profile.university_letter = file
    else:
        return Response({'error': 'Invalid document type'}, status=status.HTTP_400_BAD_REQUEST)
    
    profile.save()
    return Response({'message': 'Document uploaded successfully'}, status=status.HTTP_200_OK)