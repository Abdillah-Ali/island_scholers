from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from apps.internships.models import Internship
from apps.notifications.utils import notify_internship_deadline_reminder

@shared_task
def send_deadline_reminders():
    """Send reminders for internships with approaching deadlines"""
    tomorrow = timezone.now().date() + timedelta(days=1)
    week_from_now = timezone.now().date() + timedelta(days=7)
    
    # Get internships with deadlines in 1 day or 1 week
    upcoming_deadlines = Internship.objects.filter(
        is_active=True,
        application_deadline__in=[tomorrow, week_from_now]
    )
    
    for internship in upcoming_deadlines:
        notify_internship_deadline_reminder(internship)
    
    return f"Sent reminders for {upcoming_deadlines.count()} internships"

@shared_task
def cleanup_old_notifications():
    """Clean up notifications older than 30 days"""
    from apps.notifications.models import Notification
    
    thirty_days_ago = timezone.now() - timedelta(days=30)
    old_notifications = Notification.objects.filter(
        created_at__lt=thirty_days_ago,
        is_read=True
    )
    
    count = old_notifications.count()
    old_notifications.delete()
    
    return f"Deleted {count} old notifications"

@shared_task
def update_organization_stats():
    """Update organization statistics"""
    from apps.organizations.models import OrganizationStats
    from apps.users.models import User
    
    organizations = User.objects.filter(role='organization')
    
    for org in organizations:
        stats, created = OrganizationStats.objects.get_or_create(organization=org)
        
        stats.total_internships_posted = org.internships.count()
        stats.total_applications_received = sum(
            internship.applications.count() 
            for internship in org.internships.all()
        )
        stats.total_events_hosted = org.events.count()
        stats.save()
    
    return f"Updated stats for {organizations.count()} organizations"