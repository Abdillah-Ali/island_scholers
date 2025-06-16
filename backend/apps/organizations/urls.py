from django.urls import path
from . import views

urlpatterns = [
    path('', views.OrganizationListView.as_view(), name='organization-list'),
    path('<int:pk>/', views.OrganizationDetailView.as_view(), name='organization-detail'),
    path('<int:organization_id>/reviews/', views.OrganizationReviewsView.as_view(), name='organization-reviews'),
    path('review/create/', views.OrganizationReviewCreateView.as_view(), name='create-review'),
    path('statistics/', views.organization_statistics, name='organization-statistics'),
    path('my-stats/', views.my_organization_stats, name='my-organization-stats'),
    path('trending/', views.trending_organizations, name='trending-organizations'),
]