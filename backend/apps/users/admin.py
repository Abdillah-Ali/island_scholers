from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudentProfile, OrganizationProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'role', 'is_verified', 'created_at']
    list_filter = ['role', 'is_verified', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'profile_image', 'phone_number', 'location', 'bio', 'is_verified')
        }),
    )

@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'university', 'field_of_study', 'year_of_study', 'gpa']
    list_filter = ['university', 'field_of_study', 'year_of_study']
    search_fields = ['user__email', 'user__first_name', 'user__last_name', 'university']

@admin.register(OrganizationProfile)
class OrganizationProfileAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'industry', 'company_size', 'founded_year']
    list_filter = ['industry', 'company_size']
    search_fields = ['company_name', 'description']