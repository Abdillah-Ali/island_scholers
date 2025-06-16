from django.contrib import admin
from .models import Application, ApplicationStatusHistory

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['student', 'internship', 'status', 'applied_at', 'reviewed_at']
    list_filter = ['status', 'applied_at', 'reviewed_at']
    search_fields = ['student__email', 'student__first_name', 'student__last_name', 
                    'internship__title']
    readonly_fields = ['applied_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'student', 'internship', 'internship__organization'
        )

@admin.register(ApplicationStatusHistory)
class ApplicationStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['application', 'old_status', 'new_status', 'changed_by', 'changed_at']
    list_filter = ['old_status', 'new_status', 'changed_at']
    readonly_fields = ['changed_at']