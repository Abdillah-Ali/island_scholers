# Island Scholars Backend

Django REST API backend for the Island Scholars internship platform connecting Tanzanian students with organizations.

## Features

- **User Management**: Students and Organizations with role-based authentication
- **Internship System**: Create, manage, and apply for internships
- **Event Management**: Organizations can create and manage events
- **Application Tracking**: Complete application lifecycle management
- **Notifications**: Real-time notifications for users
- **Analytics**: Comprehensive statistics and reporting
- **Tanzania-focused**: Localized for Tanzanian market with TZS currency

## Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Task Queue**: Celery + Redis
- **File Storage**: Local storage (configurable for AWS S3)
- **Email**: SMTP support

## Quick Start

### Prerequisites

- Python 3.8+
- PostgreSQL
- Redis (for Celery tasks)

### Installation

1. **Clone and setup virtual environment**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Database setup**:
```bash
# Create PostgreSQL database
createdb island_scholars

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials
```

3. **Run migrations**:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Create superuser**:
```bash
python manage.py createsuperuser
```

5. **Start development server**:
```bash
python manage.py runserver
```

### Optional: Start Celery (for background tasks)

```bash
# In a separate terminal
celery -A config worker --loglevel=info

# For periodic tasks (in another terminal)
celery -A config beat --loglevel=info
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/verify/` - Verify token

### Users
- `POST /api/users/register/` - User registration
- `GET /api/users/profile/` - Get/update user profile
- `GET /api/users/students/` - List students
- `GET /api/users/organizations/` - List organizations

### Internships
- `GET /api/internships/` - List internships
- `POST /api/internships/create/` - Create internship (organizations only)
- `GET /api/internships/{id}/` - Get internship details
- `PUT /api/internships/{id}/update/` - Update internship
- `GET /api/internships/recommended/` - Get recommended internships (students)

### Applications
- `POST /api/applications/apply/` - Apply for internship
- `GET /api/applications/my-applications/` - Student's applications
- `GET /api/applications/received/` - Organization's received applications
- `PUT /api/applications/{id}/update-status/` - Update application status

### Events
- `GET /api/events/` - List events
- `POST /api/events/create/` - Create event (organizations only)
- `GET /api/events/{id}/` - Get event details
- `POST /api/events/register/` - Register for event (students)
- `GET /api/events/my-events/` - Organization's events

### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/read/` - Mark notification as read
- `POST /api/notifications/mark-all-read/` - Mark all as read

## Environment Variables

Create a `.env` file with the following variables:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=island_scholars
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

REDIS_URL=redis://localhost:6379/0
```

## Project Structure

```
backend/
├── config/                 # Django settings and configuration
├── apps/
│   ├── authentication/     # JWT authentication
│   ├── users/              # User management and profiles
│   ├── internships/        # Internship management
│   ├── applications/       # Application system
│   ├── events/             # Event management
│   ├── organizations/      # Organization features
│   └── notifications/      # Notification system
├── media/                  # Uploaded files
├── staticfiles/           # Static files
├── requirements.txt       # Python dependencies
└── manage.py             # Django management script
```

## Key Features

### User Roles
- **Students**: Can apply for internships, register for events, manage profiles
- **Organizations**: Can post internships, create events, manage applications

### Tanzania-Specific Features
- Currency in Tanzanian Shillings (TZS)
- Tanzanian university integration
- Local company profiles
- Swahili language support (configurable)

### Notification System
- Real-time notifications for application updates
- Email notifications (configurable)
- Deadline reminders
- Event registration confirmations

### Analytics & Reporting
- Application statistics
- Event analytics
- Organization performance metrics
- Student engagement tracking

## Development

### Running Tests
```bash
python manage.py test
```

### Creating Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Admin Interface
Access the Django admin at `http://localhost:8000/admin/` with your superuser credentials.

## Deployment

For production deployment:

1. Set `DEBUG=False` in environment
2. Configure proper database settings
3. Set up static file serving (WhiteNoise included)
4. Configure email settings
5. Set up Celery with proper broker
6. Use gunicorn for WSGI server

## API Documentation

The API follows RESTful conventions with JSON responses. All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.