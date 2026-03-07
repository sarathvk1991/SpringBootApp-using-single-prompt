Generate a full-stack application for a Smart Appointment Booking System.

BUSINESS CONTEXT
A healthcare clinic needs a system where doctors can create appointment slots and patients can book them online. An administrator oversees users and appointments.

DOMAIN MODEL

User
- id
- name
- email (unique)
- password
- role (ADMIN, DOCTOR, PATIENT)

Appointment
- id
- doctor (User with role DOCTOR)
- patient (User with role PATIENT, nullable until booked)
- appointmentTime (LocalDateTime)
- status (AVAILABLE, BOOKED, CANCELLED)

FUNCTIONAL REQUIREMENTS

User Registration
- Users can register as DOCTOR or PATIENT
- Email must be unique
- Password must be stored using BCrypt encryption

Authentication
- JWT-based stateless authentication
- Login endpoint should return a JWT token
- Token should include user role information

Appointment Management
- DOCTOR can create appointment slots for future times
- PATIENT can view available appointment slots
- PATIENT can book an available slot
- Prevent double booking of slots
- PATIENT can cancel their own appointments
- When cancelled, the slot becomes AVAILABLE again
- DOCTOR can view all appointments for their slots
- ADMIN can view all users and all appointments

AUTHORIZATION RULES
- Use role-based access control
- Enforce security using Spring Security
- Roles: ADMIN, DOCTOR, PATIENT
- Use method-level authorization where appropriate

SECURITY REQUIREMENTS
- JWT authentication
- Stateless session management
- Password encryption using BCrypt
- Validate input fields
- Prevent unauthorized access to endpoints

TECHNOLOGY STACK

Backend
- Spring Boot 3
- Java 17
- Maven build system
- Spring Data JPA
- H2 in-memory database
- Spring Security
- OpenAPI / Swagger documentation

Frontend
- React application
- Axios for API communication
- Login page
- Registration page
- Doctor dashboard to create appointment slots
- Patient dashboard to view and book appointments
- Store JWT token securely (local storage or memory)

ARCHITECTURE REQUIREMENTS
- Use layered architecture
- Controller layer for REST endpoints
- Service layer for business logic
- Repository layer using Spring Data JPA
- Use DTOs for request and response models
- Do not expose entity models directly
- Implement global exception handling

BUSINESS CONSTRAINTS
- Appointment time must always be in the future
- A slot cannot be booked more than once
- Only the patient who booked an appointment can cancel it

TESTING REQUIREMENTS
- Unit tests for service layer using JUnit 5
- Mock dependencies using Mockito
- Test booking logic and validation rules

DEVOPS REQUIREMENTS
- Provide a Dockerfile for the backend service
- Provide a GitHub Actions workflow that builds the application and runs tests

OUTPUT EXPECTATIONS
- Provide project folder structure
- Provide key backend classes
- Provide React frontend structure
- Include comments explaining important design decisions