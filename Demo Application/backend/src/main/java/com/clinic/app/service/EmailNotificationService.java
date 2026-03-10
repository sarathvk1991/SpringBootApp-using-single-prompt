package com.clinic.app.service;

import com.clinic.app.domain.Appointment;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService implements NotificationService {
    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    private final TaskScheduler taskScheduler;

    public EmailNotificationService(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    @Override
    public void notifyBooking(Appointment appointment) {
        if (appointment == null || appointment.getPatient() == null || appointment.getDoctor() == null) {
            return;
        }

        log.info("[EmailNotification] Booking confirmed: appointmentId={}, doctor={}, patient={}, time={}",
                appointment.getId(),
                appointment.getDoctor().getEmail(),
                appointment.getPatient().getEmail(),
                appointment.getAppointmentTime());
    }

    @Override
    public void scheduleReminder(Appointment appointment) {
        if (appointment == null || appointment.getPatient() == null || appointment.getDoctor() == null) {
            return;
        }

        LocalDateTime appointmentTime = appointment.getAppointmentTime();
        if (appointmentTime == null) {
            return;
        }

        LocalDateTime reminderTime = appointmentTime.minusHours(24);
        if (reminderTime.isBefore(LocalDateTime.now())) {
            return;
        }

        Date triggerTime = Date.from(reminderTime.atZone(ZoneId.systemDefault()).toInstant());
        taskScheduler.schedule(() -> {
            log.info("[EmailNotification] Reminder: appointmentId={}, doctor={}, patient={}, time={}, in {} hours",
                    appointment.getId(),
                    appointment.getDoctor().getEmail(),
                    appointment.getPatient().getEmail(),
                    appointment.getAppointmentTime(),
                    Duration.between(LocalDateTime.now(), appointment.getAppointmentTime()).toHours());
        }, triggerTime);
    }
}
