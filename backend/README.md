# Island Scholars Backend

A Spring Boot REST API backend for the Island Scholars platform - connecting Tanzanian students with internship opportunities.

## Features

- **User Management**: Students, Organizations, Universities, and Admin roles
- **Authentication**: JWT-based authentication and authorization
- **Internship System**: Complete CRUD operations for internship postings
- **Application Management**: Student applications with status tracking
- **Event Management**: Organizations can create and manage events
- **University Integration**: Universities can confirm student applications
- **Security**: Role-based access control with Spring Security
- **Database**: PostgreSQL with JPA/Hibernate

## Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Security**: Spring Security with JWT
- **Database**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven
- **Java Version**: 17

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL 12+

## Setup Instructions

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE island_scholars;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE island_scholars TO postgres;
```

### 2. Environment Configuration

The application uses the following default configuration in `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/island_scholars
    username: postgres
    password: password
```

You can override these with environment variables:
- `DATABASE_URL`
- `DATABASE_USERNAME`
- `DATABASE_PASSWORD`
- `JWT_SECRET`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`

### 3. Build and Run

```bash
# Clone the repository
git clone <repository-url>
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Internships
- `GET /api/internships` - List all active internships
- `GET /api/internships/{id}` - Get internship details
- `POST /api/internships` - Create internship (Organizations only)
- `PUT /api/internships/{id}` - Update internship (Organizations only)
- `DELETE /api/internships/{id}` - Delete internship (Organizations only)
- `GET /api/internships/my-internships` - Get organization's internships

### Applications
- `POST /api/applications` - Submit application (Students only)
- `GET /api/applications/my-applications` - Get student's applications
- `GET /api/applications/received` - Get organization's received applications
- `PUT /api/applications/{id}/status` - Update application status (Organizations only)
- `PUT /api/applications/{id}/withdraw` - Withdraw application (Students only)

### Events
- `GET /api/events` - List all active events
- `GET /api/events/upcoming` - Get upcoming events
- `POST /api/events` - Create event (Organizations only)
- `PUT /api/events/{id}` - Update event (Organizations only)
- `DELETE /api/events/{id}` - Delete event (Organizations only)

### Organizations
- `GET /api/organizations` - List all organizations
- `GET /api/organizations/{id}` - Get organization details

### Universities
- `GET /api/universities` - List all universities
- `GET /api/universities/{id}` - Get university details
- `GET /api/universities/by-name/{name}` - Get university by name

## User Roles

1. **STUDENT**: Can apply for internships, view events
2. **ORGANIZATION**: Can post internships, create events, manage applications
3. **UNIVERSITY**: Can confirm student applications, manage university data
4. **ADMIN**: Full system access

## Database Schema

The application automatically creates the following main tables:
- `users` - User accounts
- `student_profiles` - Student-specific data
- `organization_profiles` - Organization-specific data
- `universities` - University information
- `internships` - Internship postings
- `applications` - Student applications
- `events` - Organization events

## Security

- JWT tokens for authentication
- Role-based access control
- Password encryption with BCrypt
- CORS configuration for frontend integration

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -Pprod
```

### Database Migration
The application uses Hibernate's `ddl-auto: update` for development. For production, consider using Flyway or Liquibase for proper database migrations.

## Deployment

1. Set production environment variables
2. Build the application: `mvn clean package`
3. Run with: `java -jar target/island-scholars-backend-0.0.1-SNAPSHOT.jar`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.