package com.clinic.app.service;

import com.clinic.app.domain.Appointment;
import com.clinic.app.domain.AppointmentStatus;
import com.clinic.app.domain.Role;
import com.clinic.app.domain.User;
import com.clinic.app.dto.AppointmentCreateRequest;
import com.clinic.app.dto.AppointmentResponse;
import com.clinic.app.exception.BadRequestException;
import com.clinic.app.exception.ResourceNotFoundException;
import com.clinic.app.exception.UnauthorizedException;
import com.clinic.app.repository.AppointmentRepository;
import com.clinic.app.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public AppointmentResponse createSlot(AppointmentCreateRequest request) {
        User doctor = getCurrentUser();
        if (doctor.getRole() != Role.DOCTOR) {
            throw new UnauthorizedException("Only doctors can create slots");
        }
        if (request.getAppointmentTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Appointment time must be in the future");
        }
        Appointment appointment = new Appointment(doctor, request.getAppointmentTime(), AppointmentStatus.AVAILABLE);
        appointmentRepository.save(appointment);
        return toResponse(appointment);
    }

    public List<AppointmentResponse> getAvailableSlots() {
        return appointmentRepository.findByStatusAndAppointmentTimeAfter(AppointmentStatus.AVAILABLE, LocalDateTime.now())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AppointmentResponse bookSlot(Long appointmentId) {
        User patient = getCurrentUser();
        if (patient.getRole() != Role.PATIENT) {
            throw new UnauthorizedException("Only patients can book appointments");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        // Enforce single booking per slot.
        if (appointment.getStatus() != AppointmentStatus.AVAILABLE) {
            throw new BadRequestException("Appointment is not available");
        }
        if (appointment.getAppointmentTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot book past appointments");
        }

        appointment.setPatient(patient);
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointmentRepository.save(appointment);

        notificationService.notifyBooking(appointment);
        notificationService.scheduleReminder(appointment);
        return toResponse(appointment);
    }

    public AppointmentResponse cancelAppointment(Long appointmentId) {
        User patient = getCurrentUser();
        if (patient.getRole() != Role.PATIENT) {
            throw new UnauthorizedException("Only patients can cancel appointments");
        }
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (appointment.getPatient() == null || !appointment.getPatient().getId().equals(patient.getId())) {
            throw new UnauthorizedException("Only the booking patient can cancel");
        }

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new BadRequestException("Only booked appointments can be cancelled");
        }
        if (appointment.getAppointmentTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Cannot cancel past appointments");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        Appointment replacementSlot = new Appointment(
                appointment.getDoctor(),
                appointment.getAppointmentTime(),
                AppointmentStatus.AVAILABLE);
        appointmentRepository.save(replacementSlot);
        return toResponse(appointment);
    }

    public List<AppointmentResponse> getDoctorAppointments() {
        User doctor = getCurrentUser();
        if (doctor.getRole() != Role.DOCTOR) {
            throw new UnauthorizedException("Only doctors can view their appointments");
        }
        return appointmentRepository.findByDoctorId(doctor.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AppointmentResponse> getPatientAppointments() {
        User patient = getCurrentUser();
        if (patient.getRole() != Role.PATIENT) {
            throw new UnauthorizedException("Only patients can view their appointments");
        }
        return appointmentRepository.findByPatientId(patient.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            throw new UnauthorizedException("Unauthorized");
        }
        return (User) authentication.getPrincipal();
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        Long patientId = appointment.getPatient() != null ? appointment.getPatient().getId() : null;
        String patientName = appointment.getPatient() != null ? appointment.getPatient().getName() : null;
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                patientId,
                patientName,
                appointment.getAppointmentTime(),
                appointment.getStatus().name());
    }
}
