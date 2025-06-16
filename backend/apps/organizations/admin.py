from django.contrib import admin
from .models import OrganizationStats, OrganizationReview

@admin.register(OrganizationStats)
class OrganizationStatsAdmin(admin.ModelAdmin):
    list_display = ['organization', 'total_internships_posted', 'total_applications_received', 
                   'total_students_hired', 'total_events_hosted', 'profile_views']
    readonly_fields = ['last_updated']
    
    def organization(self, obj):
        return obj.organization.organization_profile.company_name

@admin.register(OrganizationReview)
class OrganizationReviewAdmin(admin.ModelAdmin):
    list_display = ['organization_name', 'student', 'rating', 'internship_experience', 
                   'would_recommend', 'is_verified', 'created_at']
    list_filter = ['rating', 'internship_experience', 'would_recommend', 'is_verified', 'created_at']
    search_fields = ['organization__organization_profile__company_name', 'student__email']
    actions = ['verify_reviews']
    
    def organization_name(self, obj):
        return obj.organization.organization_profile.company_name
    
    def verify_reviews(self, request, queryset):
        queryset.update(is_verified=True)
    verify_reviews.short_description = "Mark selected reviews as verified"