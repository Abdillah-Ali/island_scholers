from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class Internship(models.Model):
    DURATION_CHOICES = [
        ('1_month', '1 Month'),
        ('2_months', '2 Months'),
        ('3_months', '3 Months'),
        ('4_months', '4 Months'),
        ('5_months', '5 Months'),
        ('6_months', '6 Months'),
        ('other', 'Other'),
    ]
    
    organization = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='internships',
        limit_choices_to={'role': 'organization'}
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField()
    duration = models.CharField(max_length=20, choices=DURATION_CHOICES)
    location = models.CharField(max_length=200)
    is_remote = models.BooleanField(default=False)
    stipend_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Amount in TZS"
    )
    skills_required = models.JSONField(default=list, blank=True)
    application_deadline = models.DateField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    max_applicants = models.PositiveIntegerField(default=50)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.organization.organization_profile.company_name}"
    
    @property
    def applications_count(self):
        return self.applications.count()
    
    @property
    def is_deadline_passed(self):
        from django.utils import timezone
        return timezone.now().date() > self.application_deadline

class InternshipView(models.Model):
    """Track internship views for analytics"""
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, related_name='views')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    viewed_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['internship', 'user', 'ip_address']