from django.contrib import admin
from .models import Event, EventRegistration, EventFeedback

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'organization', 'event_type', 'start_date', 'location', 
                   'max_participants', 'current_participants', 'status']
    list_filter = ['event_type', 'status', 'is_virtual', 'start_date']
    search_fields = ['title', 'description', 'organization__organization_profile__company_name']
    readonly_fields = ['created_at', 'updated_at']
    
    def current_participants(self, obj):
        return obj.current_participants
    current_participants.short_description = 'Current Participants'

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['event', 'student', 'status', 'registered_at']
    list_filter = ['status', 'registered_at']
    search_fields = ['event__title', 'student__email', 'student__first_name', 'student__last_name']

@admin.register(EventFeedback)
class EventFeedbackAdmin(admin.ModelAdmin):
    list_display = ['event', 'student', 'rating', 'would_recommend', 'submitted_at']
    list_filter = ['rating', 'would_recommend', 'submitted_at']
    search_fields = ['event__title', 'student__email']