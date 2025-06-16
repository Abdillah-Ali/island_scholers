# Island Scholars Platform - Complete System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [System Architecture](#system-architecture)
3. [Django Backend Implementation](#django-backend-implementation)
4. [PostgreSQL Database Setup](#postgresql-database-setup)
5. [API Structure and Services](#api-structure-and-services)
6. [Frontend Integration](#frontend-integration)
7. [Deployment and Scaling](#deployment-and-scaling)

---

## 1. System Overview

### What is Island Scholars?
Island Scholars is a comprehensive internship management platform designed specifically for Tanzania's educational ecosystem. It connects three main stakeholders:

- **Students**: University and college students seeking mandatory internships
- **Organizations**: Companies and institutions offering internship opportunities
- **Universities**: Academic institutions managing student placements and confirmations

### How the System Works
The platform operates as a centralized hub where:
1. Organizations post internship opportunities
2. Students browse and apply for positions
3. Universities confirm and supervise student placements
4. All parties track progress through integrated dashboards

---

## 2. System Architecture

### 🔧 Overall Architecture Pattern

The Island Scholars platform follows a **3-Tier Architecture** with **Microservices** principles:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   React     │ │   Mobile    │ │   Admin     │          │
│  │   Frontend  │ │   App       │ │   Panel     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Django    │ │   REST      │ │   Business  │          │
│  │   Backend   │ │   APIs      │ │   Logic     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ PostgreSQL  │ │    Redis    │ │   File      │          │
│  │  Database   │ │   Cache     │ │  Storage    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Email     │ │     SMS     │ │   External  │          │
│  │  Service    │ │   Gateway   │ │    APIs     │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Service Layer Architecture

The backend is organized into **modular Django apps**, each handling specific business domains:

```
island_scholars_backend/
├── config/                 # Project configuration
├── apps/
│   ├── authentication/     # User authentication & JWT
│   ├── users/             # User management & profiles
│   ├── organizations/     # Organization management
│   ├── internships/       # Internship CRUD operations
│   ├── applications/      # Application workflow
│   ├── events/           # Event management
│   ├── notifications/    # Notification system
│   └── analytics/        # Reporting & analytics
├── core/                 # Shared utilities
├── media/               # File uploads
└── static/             # Static files
```

### Scalability Considerations

1. **Horizontal Scaling**: Each Django app can be deployed as separate services
2. **Database Optimization**: Read replicas, connection pooling, query optimization
3. **Caching Strategy**: Redis for session management and frequently accessed data
4. **Load Balancing**: Nginx for distributing requests across multiple Django instances
5. **CDN Integration**: For static files and media content

---

## 3. Django Backend Implementation

### 🐍 Setting Up Django with Django REST Framework

#### Step 1: Project Initialization

```bash
# Create virtual environment
python -m venv island_scholars_env
source island_scholars_env/bin/activate  # On Windows: island_scholars_env\Scripts\activate

# Install dependencies
pip install django djangorestframework psycopg2-binary python-decouple
pip install django-cors-headers django-filter djangorestframework-simplejwt
pip install celery redis pillow

# Create Django project
django-admin startproject config .
cd config

# Create Django apps
python manage.py startapp authentication
python manage.py startapp users
python manage.py startapp organizations
python manage.py startapp internships
python manage.py startapp applications
python manage.py startapp events
python manage.py startapp notifications
```

#### Step 2: Project Structure and Configuration

**config/settings.py**
```python
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = config('SECRET_KEY', default='your-secret-key')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
]

LOCAL_APPS = [
    'apps.authentication',
    'apps.users',
    'apps.organizations',
    'apps.internships',
    'apps.applications',
    'apps.events',
    'apps.notifications',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='island_scholars'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='password'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# JWT Configuration
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Media and Static Files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')

# Celery Configuration
CELERY_BROKER_URL = config('REDIS_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = config('REDIS_URL', default='redis://localhost:6379/0')
```

#### Step 3: Django Apps Structure and Best Practices

**Example: Users App Structure**

```
apps/users/
├── __init__.py
├── admin.py              # Admin interface configuration
├── apps.py              # App configuration
├── models.py            # Database models
├── serializers.py       # DRF serializers
├── views.py             # API views
├── urls.py              # URL routing
├── permissions.py       # Custom permissions
├── filters.py           # Custom filters
├── signals.py           # Django signals
├── managers.py          # Custom model managers
├── validators.py        # Custom validators
└── migrations/          # Database migrations
```

### CRUD Operations Implementation

#### Models (apps/users/models.py)
```python
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import FileExtensionValidator

class User(AbstractUser):
    USER_ROLES = (
        ('student', 'Student'),
        ('organization', 'Organization'),
        ('university', 'University'),
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
    
    def __str__(self):
        return f"{self.user.username} - {self.university}"
```

#### Serializers (apps/users/serializers.py)
```python
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StudentProfile, OrganizationProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                 'profile_image', 'phone_number', 'location', 'bio', 'is_verified', 
                 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 
                 'last_name', 'role', 'phone_number', 'location', 'bio']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile based on role
        if user.role == 'student':
            StudentProfile.objects.create(user=user)
        elif user.role == 'organization':
            OrganizationProfile.objects.create(user=user)
        
        return user
```

#### Views (apps/users/views.py)
```python
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .models import StudentProfile, OrganizationProfile
from .serializers import (
    UserSerializer, StudentProfileSerializer, OrganizationProfileSerializer,
    UserRegistrationSerializer
)

User = get_user_model()

# CREATE - User Registration
class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

# READ - Get User Profile
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

# READ - List Students
class StudentListView(generics.ListAPIView):
    queryset = StudentProfile.objects.select_related('user').all()
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['university', 'field_of_study', 'year_of_study']
    search_fields = ['user__first_name', 'user__last_name', 'university', 'field_of_study']

# UPDATE - Student Profile
class StudentProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = StudentProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile

# DELETE - Custom delete with soft delete option
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_user_account(request):
    """Soft delete user account"""
    user = request.user
    user.is_active = False
    user.save()
    return Response({'message': 'Account deactivated successfully'}, 
                   status=status.HTTP_200_OK)
```

#### URL Routing (apps/users/urls.py)
```python
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('student-profile/', views.StudentProfileView.as_view(), name='student-profile'),
    path('students/', views.StudentListView.as_view(), name='student-list'),
    path('delete-account/', views.delete_user_account, name='delete-account'),
]
```

---

## 4. PostgreSQL Database Setup

### 🛢️ Database Connection and Configuration

#### Step 1: Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (using Homebrew)
brew install postgresql

# Windows - Download from https://www.postgresql.org/download/windows/
```

#### Step 2: Create Database and User
```sql
-- Connect to PostgreSQL as superuser
sudo -u postgres psql

-- Create database
CREATE DATABASE island_scholars;

-- Create user
CREATE USER island_scholars_user WITH PASSWORD 'secure_password_123';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE island_scholars TO island_scholars_user;
ALTER USER island_scholars_user CREATEDB;

-- Exit PostgreSQL
\q
```

#### Step 3: Django Database Configuration
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'island_scholars',
        'USER': 'island_scholars_user',
        'PASSWORD': 'secure_password_123',
        'HOST': 'localhost',
        'PORT': '5432',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

### Database Schema - Complete DDL Statements

#### Core Tables DDL

```sql
-- =====================================================
-- ISLAND SCHOLARS DATABASE SCHEMA
-- =====================================================

-- Database Creation
CREATE DATABASE island_scholars
    WITH 
    OWNER = island_scholars_user
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Connect to the database
\c island_scholars;

-- =====================================================
-- 1. USERS AND AUTHENTICATION TABLES
-- =====================================================

-- Main Users Table
CREATE TABLE users_user (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMPTZ,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) UNIQUE NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'organization', 'university')),
    profile_image VARCHAR(100),
    phone_number VARCHAR(15) DEFAULT '',
    location VARCHAR(100) DEFAULT '',
    bio TEXT DEFAULT '',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for Users
CREATE INDEX idx_users_email ON users_user(email);
CREATE INDEX idx_users_role ON users_user(role);
CREATE INDEX idx_users_created_at ON users_user(created_at);
CREATE INDEX idx_users_is_active ON users_user(is_active);

-- Student Profiles Table
CREATE TABLE users_studentprofile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    university VARCHAR(200) NOT NULL,
    student_id VARCHAR(50) DEFAULT '',
    year_of_study INTEGER CHECK (year_of_study >= 1 AND year_of_study <= 6),
    field_of_study VARCHAR(100) DEFAULT '',
    gpa DECIMAL(4,2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    skills JSONB DEFAULT '[]',
    cv VARCHAR(100),
    university_letter VARCHAR(100),
    portfolio_url VARCHAR(200) DEFAULT '',
    linkedin_url VARCHAR(200) DEFAULT '',
    github_url VARCHAR(200) DEFAULT ''
);

-- Organization Profiles Table
CREATE TABLE users_organizationprofile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    industry VARCHAR(50) NOT NULL CHECK (industry IN (
        'technology', 'telecommunications', 'banking', 'aviation', 
        'healthcare', 'education', 'manufacturing', 'agriculture', 
        'tourism', 'other'
    )),
    company_size VARCHAR(50) DEFAULT '',
    description TEXT NOT NULL,
    website VARCHAR(200) DEFAULT '',
    founded_year INTEGER CHECK (founded_year >= 1800 AND founded_year <= EXTRACT(YEAR FROM NOW())),
    registration_number VARCHAR(100) DEFAULT '',
    desired_skills JSONB DEFAULT '[]'
);

-- University Profiles Table
CREATE TABLE users_universityprofile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    university_name VARCHAR(200) NOT NULL,
    established_year INTEGER CHECK (established_year >= 1800),
    student_count INTEGER DEFAULT 0 CHECK (student_count >= 0),
    faculty_count INTEGER DEFAULT 0 CHECK (faculty_count >= 0),
    programs JSONB DEFAULT '[]',
    accreditation_info TEXT DEFAULT ''
);

-- =====================================================
-- 2. INTERNSHIPS TABLES
-- =====================================================

-- Internships Table
CREATE TABLE internships_internship (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    duration VARCHAR(20) NOT NULL CHECK (duration IN (
        '1_month', '2_months', '3_months', '4_months', '5_months', '6_months', 'other'
    )),
    location VARCHAR(200) NOT NULL,
    is_remote BOOLEAN NOT NULL DEFAULT FALSE,
    stipend_amount DECIMAL(10,2) CHECK (stipend_amount >= 0),
    skills_required JSONB DEFAULT '[]',
    application_deadline DATE NOT NULL,
    start_date DATE,
    end_date DATE,
    max_applicants INTEGER DEFAULT 50 CHECK (max_applicants > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT check_dates CHECK (
        (start_date IS NULL OR end_date IS NULL) OR (end_date > start_date)
    ),
    CONSTRAINT check_deadline CHECK (application_deadline >= CURRENT_DATE)
);

-- Indexes for Internships
CREATE INDEX idx_internships_organization ON internships_internship(organization_id);
CREATE INDEX idx_internships_active ON internships_internship(is_active);
CREATE INDEX idx_internships_deadline ON internships_internship(application_deadline);
CREATE INDEX idx_internships_location ON internships_internship(location);
CREATE INDEX idx_internships_duration ON internships_internship(duration);
CREATE INDEX idx_internships_created_at ON internships_internship(created_at);

-- Internship Views (for analytics)
CREATE TABLE internships_internshipview (
    id SERIAL PRIMARY KEY,
    internship_id INTEGER NOT NULL REFERENCES internships_internship(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users_user(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(internship_id, user_id, ip_address)
);

-- =====================================================
-- 3. APPLICATIONS TABLES
-- =====================================================

-- Applications Table
CREATE TABLE applications_application (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    internship_id INTEGER NOT NULL REFERENCES internships_internship(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL,
    resume VARCHAR(100) NOT NULL,
    portfolio_url VARCHAR(200) DEFAULT '',
    availability VARCHAR(50) DEFAULT '',
    preferred_start_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'under_review', 'accepted', 'rejected', 'withdrawn'
    )),
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewer_notes TEXT DEFAULT '',
    
    UNIQUE(student_id, internship_id)
);

-- Application Status History
CREATE TABLE applications_applicationstatushistory (
    id SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL REFERENCES applications_application(id) ON DELETE CASCADE,
    old_status VARCHAR(20) NOT NULL,
    new_status VARCHAR(20) NOT NULL,
    changed_by_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT DEFAULT ''
);

-- Indexes for Applications
CREATE INDEX idx_applications_student ON applications_application(student_id);
CREATE INDEX idx_applications_internship ON applications_application(internship_id);
CREATE INDEX idx_applications_status ON applications_application(status);
CREATE INDEX idx_applications_applied_at ON applications_application(applied_at);

-- =====================================================
-- 4. EVENTS TABLES
-- =====================================================

-- Events Table
CREATE TABLE events_event (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN (
        'hackathon', 'career_fair', 'workshop', 'competition', 
        'networking', 'conference', 'seminar', 'other'
    )),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(200) NOT NULL,
    is_virtual BOOLEAN NOT NULL DEFAULT FALSE,
    max_participants INTEGER NOT NULL CHECK (max_participants > 0),
    registration_deadline TIMESTAMPTZ NOT NULL,
    requirements TEXT DEFAULT '',
    prizes JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'active', 'completed', 'cancelled'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT check_event_dates CHECK (end_date > start_date),
    CONSTRAINT check_registration_deadline CHECK (registration_deadline < start_date)
);

-- Event Registrations Table
CREATE TABLE events_eventregistration (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events_event(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'cancelled', 'waitlist'
    )),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    additional_info TEXT DEFAULT '',
    
    UNIQUE(event_id, student_id)
);

-- Event Feedback Table
CREATE TABLE events_eventfeedback (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events_event(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT '',
    would_recommend BOOLEAN NOT NULL DEFAULT TRUE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(event_id, student_id)
);

-- =====================================================
-- 5. NOTIFICATIONS TABLES
-- =====================================================

-- Notifications Table
CREATE TABLE notifications_notification (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN (
        'application', 'internship', 'event', 'review', 'system', 'reminder'
    )),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Optional related objects
    related_application_id INTEGER,
    related_internship_id INTEGER,
    related_event_id INTEGER
);

-- Notification Preferences Table
CREATE TABLE notifications_notificationpreference (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    
    -- Email notifications
    email_applications BOOLEAN NOT NULL DEFAULT TRUE,
    email_internships BOOLEAN NOT NULL DEFAULT TRUE,
    email_events BOOLEAN NOT NULL DEFAULT TRUE,
    email_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- In-app notifications
    app_applications BOOLEAN NOT NULL DEFAULT TRUE,
    app_internships BOOLEAN NOT NULL DEFAULT TRUE,
    app_events BOOLEAN NOT NULL DEFAULT TRUE,
    app_reminders BOOLEAN NOT NULL DEFAULT TRUE
);

-- =====================================================
-- 6. ORGANIZATION ANALYTICS TABLES
-- =====================================================

-- Organization Statistics
CREATE TABLE organizations_organizationstats (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER UNIQUE NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    total_internships_posted INTEGER DEFAULT 0 CHECK (total_internships_posted >= 0),
    total_applications_received INTEGER DEFAULT 0 CHECK (total_applications_received >= 0),
    total_students_hired INTEGER DEFAULT 0 CHECK (total_students_hired >= 0),
    total_events_hosted INTEGER DEFAULT 0 CHECK (total_events_hosted >= 0),
    profile_views INTEGER DEFAULT 0 CHECK (profile_views >= 0),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Organization Reviews
CREATE TABLE organizations_organizationreview (
    id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES users_user(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    internship_experience BOOLEAN NOT NULL DEFAULT FALSE,
    would_recommend BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    
    UNIQUE(organization_id, student_id)
);

-- =====================================================
-- 7. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users_user 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON internships_internship 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events_event 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update organization stats
CREATE OR REPLACE FUNCTION update_organization_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stats when internships are created/updated
    IF TG_TABLE_NAME = 'internships_internship' THEN
        UPDATE organizations_organizationstats 
        SET total_internships_posted = (
            SELECT COUNT(*) FROM internships_internship 
            WHERE organization_id = NEW.organization_id
        ),
        last_updated = NOW()
        WHERE organization_id = NEW.organization_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for organization stats
CREATE TRIGGER update_org_stats_on_internship 
    AFTER INSERT OR UPDATE ON internships_internship
    FOR EACH ROW EXECUTE FUNCTION update_organization_stats();

-- =====================================================
-- 8. INITIAL DATA AND CONSTRAINTS
-- =====================================================

-- Create indexes for performance
CREATE INDEX idx_notifications_recipient ON notifications_notification(recipient_id);
CREATE INDEX idx_notifications_type ON notifications_notification(notification_type);
CREATE INDEX idx_notifications_read ON notifications_notification(is_read);
CREATE INDEX idx_events_organization ON events_event(organization_id);
CREATE INDEX idx_events_type ON events_event(event_type);
CREATE INDEX idx_events_status ON events_event(status);
CREATE INDEX idx_event_registrations_event ON events_eventregistration(event_id);
CREATE INDEX idx_event_registrations_student ON events_eventregistration(student_id);

-- Add foreign key constraints for related objects in notifications
ALTER TABLE notifications_notification 
ADD CONSTRAINT fk_notification_application 
FOREIGN KEY (related_application_id) REFERENCES applications_application(id) ON DELETE SET NULL;

ALTER TABLE notifications_notification 
ADD CONSTRAINT fk_notification_internship 
FOREIGN KEY (related_internship_id) REFERENCES internships_internship(id) ON DELETE SET NULL;

ALTER TABLE notifications_notification 
ADD CONSTRAINT fk_notification_event 
FOREIGN KEY (related_event_id) REFERENCES events_event(id) ON DELETE SET NULL;

-- =====================================================
-- 9. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for active internships with organization details
CREATE VIEW active_internships_view AS
SELECT 
    i.id,
    i.title,
    i.description,
    i.location,
    i.duration,
    i.stipend_amount,
    i.application_deadline,
    i.skills_required,
    i.created_at,
    o.company_name as organization_name,
    o.industry,
    u.profile_image as organization_logo,
    (SELECT COUNT(*) FROM applications_application a WHERE a.internship_id = i.id) as application_count
FROM internships_internship i
JOIN users_user u ON i.organization_id = u.id
JOIN users_organizationprofile o ON u.id = o.user_id
WHERE i.is_active = TRUE 
AND i.application_deadline >= CURRENT_DATE;

-- View for application statistics
CREATE VIEW application_statistics_view AS
SELECT 
    i.organization_id,
    o.company_name,
    COUNT(a.id) as total_applications,
    COUNT(CASE WHEN a.status = 'pending' THEN 1 END) as pending_applications,
    COUNT(CASE WHEN a.status = 'accepted' THEN 1 END) as accepted_applications,
    COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_applications
FROM internships_internship i
LEFT JOIN applications_application a ON i.id = a.internship_id
JOIN users_organizationprofile o ON i.organization_id = o.user_id
GROUP BY i.organization_id, o.company_name;

-- =====================================================
-- 10. SAMPLE DATA (Optional)
-- =====================================================

-- Insert sample admin user
INSERT INTO users_user (
    username, email, first_name, last_name, role, is_staff, is_superuser, is_verified
) VALUES (
    'admin', 'admin@islandscholars.com', 'System', 'Administrator', 'organization', TRUE, TRUE, TRUE
);

-- Grant all necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO island_scholars_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO island_scholars_user;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
```

### Django Migrations

After creating your models, generate and apply migrations:

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

---

## 5. API Structure and Services

### RESTful API Design Principles

The Island Scholars API follows REST conventions with clear, predictable endpoints:

```
Base URL: https://api.islandscholars.com/api/v1/

Authentication Endpoints:
POST   /auth/login/                 # User login
POST   /auth/logout/                # User logout
POST   /auth/refresh/               # Refresh JWT token
GET    /auth/verify/                # Verify token

User Management:
POST   /users/register/             # User registration
GET    /users/profile/              # Get user profile
PUT    /users/profile/              # Update user profile
GET    /users/students/             # List students
GET    /users/organizations/        # List organizations

Internship Management:
GET    /internships/                # List internships
POST   /internships/create/         # Create internship
GET    /internships/{id}/           # Get internship details
PUT    /internships/{id}/update/    # Update internship
DELETE /internships/{id}/delete/    # Delete internship
GET    /internships/recommended/    # Get recommended internships

Application Management:
POST   /applications/apply/         # Apply for internship
GET    /applications/my-applications/     # Student's applications
GET    /applications/received/      # Organization's applications
PUT    /applications/{id}/update-status/  # Update application status
POST   /applications/{id}/withdraw/ # Withdraw application

Event Management:
GET    /events/                     # List events
POST   /events/create/              # Create event
GET    /events/{id}/                # Get event details
POST   /events/register/            # Register for event
GET    /events/my-events/           # Organization's events

Notification Management:
GET    /notifications/              # List notifications
POST   /notifications/{id}/read/    # Mark as read
POST   /notifications/mark-all-read/ # Mark all as read
```

### Service Layer Architecture

```python
# apps/core/services.py
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

class BaseService(ABC):
    """Base service class for common operations"""
    
    @abstractmethod
    def create(self, data: Dict[str, Any]) -> Any:
        pass
    
    @abstractmethod
    def get_by_id(self, id: int) -> Optional[Any]:
        pass
    
    @abstractmethod
    def update(self, id: int, data: Dict[str, Any]) -> Any:
        pass
    
    @abstractmethod
    def delete(self, id: int) -> bool:
        pass

# apps/internships/services.py
from django.db.models import Q
from .models import Internship
from apps.core.services import BaseService

class InternshipService(BaseService):
    """Service for internship-related operations"""
    
    def create(self, data: Dict[str, Any]) -> Internship:
        return Internship.objects.create(**data)
    
    def get_by_id(self, id: int) -> Optional[Internship]:
        try:
            return Internship.objects.select_related('organization').get(id=id)
        except Internship.DoesNotExist:
            return None
    
    def get_active_internships(self) -> List[Internship]:
        return Internship.objects.filter(
            is_active=True,
            application_deadline__gte=timezone.now().date()
        ).select_related('organization')
    
    def search_internships(self, query: str, filters: Dict[str, Any]) -> List[Internship]:
        queryset = self.get_active_internships()
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) | 
                Q(description__icontains=query) |
                Q(skills_required__overlap=[query])
            )
        
        if filters.get('location'):
            queryset = queryset.filter(location__icontains=filters['location'])
        
        if filters.get('duration'):
            queryset = queryset.filter(duration=filters['duration'])
        
        if filters.get('is_remote'):
            queryset = queryset.filter(is_remote=True)
        
        return queryset
    
    def get_recommended_internships(self, student_skills: List[str]) -> List[Internship]:
        if not student_skills:
            return self.get_active_internships()[:10]
        
        return Internship.objects.filter(
            is_active=True,
            skills_required__overlap=student_skills
        ).order_by('-created_at')[:10]
    
    def update(self, id: int, data: Dict[str, Any]) -> Internship:
        internship = self.get_by_id(id)
        if internship:
            for key, value in data.items():
                setattr(internship, key, value)
            internship.save()
        return internship
    
    def delete(self, id: int) -> bool:
        internship = self.get_by_id(id)
        if internship:
            internship.delete()
            return True
        return False
```

---

## 6. Frontend Integration

### API Client Setup (React)

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });
        
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// API service functions
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login/', credentials),
  logout: () => apiClient.post('/auth/logout/'),
  register: (userData) => apiClient.post('/users/register/', userData),
  verifyToken: () => apiClient.get('/auth/verify/'),
};

export const internshipAPI = {
  getInternships: (params) => apiClient.get('/internships/', { params }),
  getInternshipById: (id) => apiClient.get(`/internships/${id}/`),
  createInternship: (data) => apiClient.post('/internships/create/', data),
  updateInternship: (id, data) => apiClient.put(`/internships/${id}/update/`, data),
  deleteInternship: (id) => apiClient.delete(`/internships/${id}/delete/`),
  getRecommended: () => apiClient.get('/internships/recommended/'),
};

export const applicationAPI = {
  applyForInternship: (data) => apiClient.post('/applications/apply/', data),
  getMyApplications: () => apiClient.get('/applications/my-applications/'),
  getReceivedApplications: (params) => apiClient.get('/applications/received/', { params }),
  updateApplicationStatus: (id, data) => apiClient.put(`/applications/${id}/update-status/`, data),
  withdrawApplication: (id) => apiClient.post(`/applications/${id}/withdraw/`),
};
```

---

## 7. Deployment and Scaling

### Production Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOAD BALANCER (Nginx)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION SERVERS                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │   Django    │ │   Django    │ │   Django    │          │
│  │  Instance 1 │ │  Instance 2 │ │  Instance 3 │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ PostgreSQL  │ │    Redis    │ │   Celery    │          │
│  │  Primary    │ │   Cache     │ │   Workers   │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│  │ PostgreSQL  │ │   File      │ │   Email     │          │
│  │  Read Rep.  │ │  Storage    │ │  Service    │          │
│  └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### Docker Configuration

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: island_scholars
      POSTGRES_USER: island_scholars_user
      POSTGRES_PASSWORD: secure_password_123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  web:
    build: .
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://island_scholars_user:secure_password_123@db:5432/island_scholars

  celery:
    build: .
    command: celery -A config worker --loglevel=info
    volumes:
      - .:/app
    depends_on:
      - db
      - redis

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    depends_on:
      - web

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

### Performance Optimization

1. **Database Optimization**
   - Use select_related() and prefetch_related() for efficient queries
   - Implement database indexing for frequently queried fields
   - Use database connection pooling
   - Implement read replicas for read-heavy operations

2. **Caching Strategy**
   - Redis for session storage and frequently accessed data
   - Cache API responses for static data
   - Implement cache invalidation strategies

3. **API Optimization**
   - Implement pagination for large datasets
   - Use Django REST Framework's filtering and searching
   - Implement API rate limiting
   - Use compression for API responses

4. **Security Best Practices**
   - Use HTTPS in production
   - Implement proper CORS settings
   - Use environment variables for sensitive data
   - Regular security updates and monitoring

This comprehensive documentation provides a complete blueprint for implementing the Island Scholars platform using Django and PostgreSQL, with clear explanations of architecture, implementation details, and deployment strategies.