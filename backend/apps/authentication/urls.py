from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('refresh/', views.refresh_token_view, name='token-refresh'),
    path('verify/', views.verify_token_view, name='verify-token'),
]