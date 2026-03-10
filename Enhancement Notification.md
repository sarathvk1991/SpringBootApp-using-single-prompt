Enhance the Smart Appointment Booking System with appointment notifications.

New Functional Requirements:

Appointment Notifications
- Send a notification when an appointment is successfully booked.
- Send a reminder notification 24 hours before the appointment time.
- Both the doctor and patient should receive the notification.

Notification Service
- Create a NotificationService interface.
- Implement a basic EmailNotificationService (simulation is sufficient).
- The service should be triggered after successful appointment booking.

Architecture Requirements
- The notification logic should be implemented in the service layer.
- Do not place notification logic directly in controllers.
- Use dependency injection for the notification service.

Business Constraints
- Notifications should only be sent for confirmed bookings.
- Reminder should only be scheduled for future appointments.

Output Expectations
- Update the service layer to trigger notifications.
- Provide the NotificationService interface and implementation.
- Show where the notification is triggered in the booking workflow.