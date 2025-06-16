from django.urls import path
from . import views

urlpatterns = [
    path('', views.InternshipListView.as_view(), name='internship-list'),
    path('create/', views.InternshipCreateView.as_view(), name='internship-create'),
    path('<int:pk>/', views.InternshipDetailView.as_view(), name='internship-detail'),
    path('<int:pk>/update/', views.InternshipUpdateView.as_view(), name='internship-update'),
    path('<int:pk>/delete/', views.InternshipDeleteView.as_view(), name='internship-delete'),
    path('<int:pk>/analytics/', views.internship_analytics, name='internship-analytics'),
    path('my-internships/', views.OrganizationInternshipsView.as_view(), name='my-internships'),
    path('recommended/', views.recommended_internships, name='recommended-internships'),
]