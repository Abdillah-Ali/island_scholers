from django.contrib import admin
from .models import Internship, InternshipView

@admin.register(Internship)
class InternshipAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'location', 'duration', 'stipend_amount', 
                   'application_deadline', 'is_active', 'created_at']
    list_filter = ['is_active', 'is_remote', 'duration', 'created_at']
    search_fields = ['title', 'description', 'organization__organization_profile__company_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('organization__organization_profile')

@admin.register(InternshipView)
class InternshipViewAdmin(admin.ModelAdmin):
    list_display = ['internship', 'user', 'ip_address', 'viewed_at']
    list_filter = ['viewed_at']
    readonly_fields = ['viewed_at']