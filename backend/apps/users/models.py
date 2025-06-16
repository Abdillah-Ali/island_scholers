from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator

class User(AbstractUser):
    USER_ROLES = (
        ('student', 'Student'),
        ('organization', 'Organization'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=USER_ROLES)
    profile_image = models.ImageField(
        upload_to='profile_images/', 
        null=True, 
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])]
    )
    phone_number = models.CharField(max_length=15, blank=True)
    location = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']
    
    def __str__(self):
        return f"{self.email} ({self.role})"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    university = models.CharField(max_length=200)
    student_id = models.CharField(max_length=50, blank=True)
    year_of_study = models.IntegerField(null=True, blank=True)
    field_of_study = models.CharField(max_length=100, blank=True)
    gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    skills = models.JSONField(default=list, blank=True)
    cv = models.FileField(
        upload_to='documents/cv/', 
        null=True, 
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    university_letter = models.FileField(
        upload_to='documents/letters/', 
        null=True, 
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'doc', 'docx'])]
    )
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.university}"

class OrganizationProfile(models.Model):
    INDUSTRY_CHOICES = [
        ('technology', 'Technology'),
        ('telecommunications', 'Telecommunications'),
        ('banking', 'Banking & Finance'),
        ('aviation', 'Aviation'),
        ('healthcare', 'Healthcare'),
        ('education', 'Education'),
        ('manufacturing', 'Manufacturing'),
        ('agriculture', 'Agriculture'),
        ('tourism', 'Tourism'),
        ('other', 'Other'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='organization_profile')
    company_name = models.CharField(max_length=200)
    industry = models.CharField(max_length=50, choices=INDUSTRY_CHOICES)
    company_size = models.CharField(max_length=50, blank=True)
    description = models.TextField()
    website = models.URLField(blank=True)
    founded_year = models.IntegerField(null=True, blank=True)
    registration_number = models.CharField(max_length=100, blank=True)
    desired_skills = models.JSONField(default=list, blank=True)
    
    def __str__(self):
        return self.company_name