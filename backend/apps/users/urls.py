from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('student-profile/', views.StudentProfileView.as_view(), name='student-profile'),
    path('organization-profile/', views.OrganizationProfileView.as_view(), name='organization-profile'),
    path('students/', views.StudentListView.as_view(), name='student-list'),
    path('organizations/', views.OrganizationListView.as_view(), name='organization-list'),
    path('upload-document/', views.upload_document, name='upload-document'),
]