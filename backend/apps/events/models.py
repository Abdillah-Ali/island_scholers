from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()

class Event(models.Model):
    EVENT_TYPES = [
        ('hackathon', 'Hackathon'),
        ('career_fair', 'Career Fair'),
        ('workshop', 'Workshop'),
        ('competition', 'Competition'),
        ('networking', 'Networking Event'),
        ('conference', 'Conference'),
        ('seminar', 'Seminar'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    organization = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='events',
        limit_choices_to={'role': 'organization'}
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=200)
    is_virtual = models.BooleanField(default=False)
    max_participants = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    registration_deadline = models.DateTimeField()
    requirements = models.TextField(blank=True)
    prizes = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.organization.organization_profile.company_name}"
    
    @property
    def current_participants(self):
        return self.registrations.filter(status='confirmed').count()
    
    @property
    def is_registration_open(self):
        from django.utils import timezone
        return (
            self.status == 'active' and 
            timezone.now() < self.registration_deadline and
            self.current_participants < self.max_participants
        )

class EventRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('waitlist', 'Waitlist'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='event_registrations',
        limit_choices_to={'role': 'student'}
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    registered_at = models.DateTimeField(auto_now_add=True)
    additional_info = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['event', 'student']
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.event.title}"

class EventFeedback(models.Model):
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='feedback')
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='event_feedback',
        limit_choices_to={'role': 'student'}
    )
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    would_recommend = models.BooleanField(default=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['event', 'student']
        ordering = ['-submitted_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.event.title} ({self.rating}/5)"