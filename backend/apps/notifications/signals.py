from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.applications.models import Application
from apps.events.models import EventRegistration
from .utils import notify_application_status_change, notify_new_application, notify_event_registration

@receiver(post_save, sender=Application)
def handle_application_notifications(sender, instance, created, **kwargs):
    """Handle notifications when applications are created or updated"""
    if created:
        # Notify organization about new application
        notify_new_application(instance)
    else:
        # Notify student about status change
        notify_application_status_change(instance)

@receiver(post_save, sender=EventRegistration)
def handle_event_registration_notifications(sender, instance, created, **kwargs):
    """Handle notifications when someone registers for an event"""
    if created:
        notify_event_registration(instance)