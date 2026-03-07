package com.clinic.app.dto;

import java.time.LocalDateTime;

public class AppointmentResponse {
    private final Long id;
    private final Long doctorId;
    private final String doctorName;
    private final Long patientId;
    private final String patientName;
    private final LocalDateTime appointmentTime;
    private final String status;

    public AppointmentResponse(Long id, Long doctorId, String doctorName, Long patientId, String patientName,
                               LocalDateTime appointmentTime, String status) {
        this.id = id;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.patientId = patientId;
        this.patientName = patientName;
        this.appointmentTime = appointmentTime;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public Long getPatientId() {
        return patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public LocalDateTime getAppointmentTime() {
        return appointmentTime;
    }

    public String getStatus() {
        return status;
    }
}
