package com.clinic.app.repository;

import com.clinic.app.domain.Appointment;
import com.clinic.app.domain.AppointmentStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStatusAndAppointmentTimeAfter(AppointmentStatus status, LocalDateTime now);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByPatientId(Long patientId);
}
