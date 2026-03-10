Enhance the Smart Appointment Booking System with appointment cancellation functionality.

New Functional Requirements:

Appointment Cancellation
- A patient should be able to cancel a booked appointment.
- Only the patient who originally booked the appointment can cancel it.
- Doctors and administrators should be able to view cancelled appointments.

Business Rules
- When an appointment is cancelled, its status must change to CANCELLED.
- Once cancelled, the appointment slot should become AVAILABLE again.
- The system must prevent cancellation of appointments that are already completed or already cancelled.

Authorization Rules
- Only the patient who owns the appointment can cancel it.
- Doctors can view cancellations for their own appointment slots.
- Administrators can view all cancelled appointments.

Architecture Requirements
- Implement the cancellation logic in the service layer.
- Expose a REST endpoint for cancellation through the controller layer.
- Use DTOs for request and response models.
- Ensure proper exception handling when invalid cancellation attempts occur.

Testing Requirements
- Add unit tests validating the cancellation workflow.
- Ensure tests verify appointment ownership and slot availability updates.

Output Expectations
- Update service layer logic to support appointment cancellation.
- Provide the controller endpoint for cancelling an appointment.
- Show how appointment status and slot availability are updated after cancellation.