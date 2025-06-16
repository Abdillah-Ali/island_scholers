from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class OrganizationStats(models.Model):
    """Track organization statistics and metrics"""
    organization = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='stats',
        limit_choices_to={'role': 'organization'}
    )
    total_internships_posted = models.PositiveIntegerField(default=0)
    total_applications_received = models.PositiveIntegerField(default=0)
    total_students_hired = models.PositiveIntegerField(default=0)
    total_events_hosted = models.PositiveIntegerField(default=0)
    profile_views = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Stats for {self.organization.organization_profile.company_name}"

class OrganizationReview(models.Model):
    """Student reviews for organizations"""
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    organization = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='reviews',
        limit_choices_to={'role': 'organization'}
    )
    student = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='organization_reviews',
        limit_choices_to={'role': 'student'}
    )
    rating = models.IntegerField(choices=RATING_CHOICES)
    review_text = models.TextField()
    internship_experience = models.BooleanField(default=False)
    would_recommend = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['organization', 'student']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.student.username} - {self.organization.organization_profile.company_name} ({self.rating}/5)"