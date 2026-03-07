# Smart Appointment Booking System

Full-stack application for doctors to create appointment slots, patients to book them, and admins to oversee users and appointments.

## Structure
- backend/: Spring Boot 3 API (Java 17, Maven, JPA, H2, JWT, Swagger)
- frontend/: React app (Vite, Axios)

## Backend
Key features:
- Layered architecture (controllers/services/repositories)
- DTO-based API (entities not exposed)
- JWT stateless auth with role-based access control
- Global exception handling
- Swagger UI at /swagger-ui

Run locally (from backend/):
- mvn spring-boot:run

## Frontend
Run locally (from frontend/):
- npm install
- npm run dev

The frontend expects the backend at http://localhost:8080.

## Notes
- Default JWT secret is for development only. Replace `app.jwt.secret` in backend/src/main/resources/application.yml for production.
- H2 console is available at /h2-console

## API Overview
- POST /api/auth/register
- POST /api/auth/login
- POST /api/appointments/slots (DOCTOR)
- GET /api/appointments/available (PATIENT)
- POST /api/appointments/{id}/book (PATIENT)
- POST /api/appointments/{id}/cancel (PATIENT)
- GET /api/appointments/mine (PATIENT)
- GET /api/appointments/doctor (DOCTOR)
- GET /api/admin/users (ADMIN)
- GET /api/admin/appointments (ADMIN)
