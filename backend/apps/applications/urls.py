from django.urls import path
from . import views

urlpatterns = [
    path('apply/', views.ApplicationCreateView.as_view(), name='application-create'),
    path('my-applications/', views.StudentApplicationsView.as_view(), name='student-applications'),
    path('received/', views.OrganizationApplicationsView.as_view(), name='organization-applications'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:pk>/update-status/', views.ApplicationStatusUpdateView.as_view(), name='application-status-update'),
    path('<int:pk>/withdraw/', views.withdraw_application, name='application-withdraw'),
    path('statistics/', views.application_statistics, name='application-statistics'),
]