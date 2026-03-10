Enhance the Smart Appointment Booking System with appointment rescheduling functionality.

New Functional Requirements:

Appointment Rescheduling
- A patient should be able to move an existing appointment to another available slot.
- Only the patient who originally booked the appointment can reschedule it.
- The new slot must be AVAILABLE.
- The previous slot must become AVAILABLE again after rescheduling.

Business Rules
- Rescheduling should update the appointmentTime field.
- The status should remain BOOKED for the new slot.
- The system must prevent double booking during rescheduling.

Authorization Rules
- Only the patient who owns the appointment can reschedule it.
- Doctors and admins can view rescheduled appointments but cannot perform the action.

Architecture Requirements
- Implement rescheduling logic in the service layer.
- Expose a REST endpoint for rescheduling through the controller layer.
- Ensure DTOs are used for request and response models.

Testing Requirements
- Add unit tests validating rescheduling logic.
- Ensure tests verify slot availability and ownership validation.

Output Expectations
- Update service layer logic for rescheduling.
- Provide controller endpoint for rescheduling.
- Show how appointment status and slot availability are updated.