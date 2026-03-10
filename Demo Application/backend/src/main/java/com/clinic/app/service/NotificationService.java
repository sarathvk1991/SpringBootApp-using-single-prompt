package com.clinic.app.service;

import com.clinic.app.domain.Appointment;

public interface NotificationService {
    void notifyBooking(Appointment appointment);

    void scheduleReminder(Appointment appointment);
}
