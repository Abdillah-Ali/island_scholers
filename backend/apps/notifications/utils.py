from django.core.mail import send_mail
from django.conf import settings
from .models import Notification, NotificationPreference

def create_notification(recipient, title, message, notification_type, **kwargs):
    """Create a new notification for a user"""
    notification = Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type,
        **kwargs
    )
    
    # Check if user wants email notifications
    preferences, created = NotificationPreference.objects.get_or_create(user=recipient)
    
    should_send_email = False
    if notification_type == 'application' and preferences.email_applications:
        should_send_email = True
    elif notification_type == 'internship' and preferences.email_internships:
        should_send_email = True
    elif notification_type == 'event' and preferences.email_events:
        should_send_email = True
    elif notification_type == 'reminder' and preferences.email_reminders:
        should_send_email = True
    
    if should_send_email and settings.EMAIL_HOST_USER:
        send_email_notification(recipient, title, message)
    
    return notification

def send_email_notification(recipient, title, message):
    """Send email notification to user"""
    try:
        send_mail(
            subject=f"Island Scholars - {title}",
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient.email],
            fail_silently=True,
        )
    except Exception as e:
        print(f"Failed to send email notification: {e}")

def notify_application_status_change(application):
    """Notify student about application status change"""
    status_messages = {
        'under_review': 'Your application is now under review.',
        'accepted': 'Congratulations! Your application has been accepted.',
        'rejected': 'Unfortunately, your application was not successful this time.',
    }
    
    if application.status in status_messages:
        create_notification(
            recipient=application.student,
            title=f"Application Update - {application.internship.title}",
            message=status_messages[application.status],
            notification_type='application',
            related_application_id=application.id,
            related_internship_id=application.internship.id
        )

def notify_new_application(application):
    """Notify organization about new application"""
    create_notification(
        recipient=application.internship.organization,
        title=f"New Application - {application.internship.title}",
        message=f"{application.student.get_full_name()} has applied for {application.internship.title}",
        notification_type='application',
        related_application_id=application.id,
        related_internship_id=application.internship.id
    )

def notify_event_registration(registration):
    """Notify organization about new event registration"""
    create_notification(
        recipient=registration.event.organization,
        title=f"New Event Registration - {registration.event.title}",
        message=f"{registration.student.get_full_name()} has registered for {registration.event.title}",
        notification_type='event',
        related_event_id=registration.event.id
    )

def notify_internship_deadline_reminder(internship):
    """Notify students about approaching internship deadlines"""
    from apps.users.models import User
    
    students = User.objects.filter(role='student')
    for student in students:
        create_notification(
            recipient=student,
            title=f"Application Deadline Reminder - {internship.title}",
            message=f"The application deadline for {internship.title} is approaching. Apply now!",
            notification_type='reminder',
            related_internship_id=internship.id
        )