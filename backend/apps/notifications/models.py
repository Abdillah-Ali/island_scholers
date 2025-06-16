from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('application', 'Application'),
        ('internship', 'Internship'),
        ('event', 'Event'),
        ('review', 'Review'),
        ('system', 'System'),
        ('reminder', 'Reminder'),
    ]
    
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Optional related objects
    related_application_id = models.PositiveIntegerField(null=True, blank=True)
    related_internship_id = models.PositiveIntegerField(null=True, blank=True)
    related_event_id = models.PositiveIntegerField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.recipient.username} - {self.title}"

class NotificationPreference(models.Model):
    """User preferences for notifications"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    
    # Email notifications
    email_applications = models.BooleanField(default=True)
    email_internships = models.BooleanField(default=True)
    email_events = models.BooleanField(default=True)
    email_reminders = models.BooleanField(default=True)
    
    # In-app notifications
    app_applications = models.BooleanField(default=True)
    app_internships = models.BooleanField(default=True)
    app_events = models.BooleanField(default=True)
    app_reminders = models.BooleanField(default=True)
    
    def __str__(self):
        return f"Notification preferences for {self.user.username}"