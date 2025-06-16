from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import FileExtensionValidator
from apps.internships.models import Internship

User = get_user_model()

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='applications',
        limit_choices_to={'role': 'student'}
    )
    internship = models.ForeignKey(
        Internship, 
        on_delete=models.CASCADE, 
        related_name='applications'
    )
    cover_letter = models.TextField()
    resume = models.FileField(
        upload_to='applications/resumes/',
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    portfolio_url = models.URLField(blank=True)
    availability = models.CharField(max_length=50, blank=True)
    preferred_start_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewer_notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['student', 'internship']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.internship.title}"

class ApplicationStatusHistory(models.Model):
    """Track status changes for applications"""
    application = models.ForeignKey(
        Application, 
        on_delete=models.CASCADE, 
        related_name='status_history'
    )
    old_status = models.CharField(max_length=20, choices=Application.STATUS_CHOICES)
    new_status = models.CharField(max_length=20, choices=Application.STATUS_CHOICES)
    changed_by = models.ForeignKey(User, on_delete=models.CASCADE)
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-changed_at']
    
    def __str__(self):
        return f"{self.application} - {self.old_status} to {self.new_status}"