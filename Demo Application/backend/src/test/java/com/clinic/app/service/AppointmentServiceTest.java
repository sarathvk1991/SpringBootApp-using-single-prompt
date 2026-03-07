package com.clinic.app.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.clinic.app.domain.Appointment;
import com.clinic.app.domain.AppointmentStatus;
import com.clinic.app.domain.Role;
import com.clinic.app.domain.User;
import com.clinic.app.dto.AppointmentCreateRequest;
import com.clinic.app.exception.BadRequestException;
import com.clinic.app.repository.AppointmentRepository;
import com.clinic.app.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private User doctor;
    private User patient;

    @BeforeEach
    void setup() {
        doctor = new User("Dr. Who", "doctor@example.com", "encoded", Role.DOCTOR);
        patient = new User("Amy", "patient@example.com", "encoded", Role.PATIENT);
    }

    @AfterEach
    void clear() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createSlotRejectsPastTime() {
        setAuth(doctor);
        AppointmentCreateRequest request = new AppointmentCreateRequest();
        request.setAppointmentTime(LocalDateTime.now().minusHours(1));

        assertThrows(BadRequestException.class, () -> appointmentService.createSlot(request));
    }

    @Test
    void bookSlotSucceedsWhenAvailable() {
        setAuth(patient);
        Appointment appointment = new Appointment(doctor, LocalDateTime.now().plusDays(1), AppointmentStatus.AVAILABLE);

        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = appointmentService.bookSlot(1L);
        assertEquals(AppointmentStatus.BOOKED.name(), response.getStatus());
        assertEquals(patient.getName(), response.getPatientName());
    }

    @Test
    void bookSlotRejectsUnavailable() {
        setAuth(patient);
        Appointment appointment = new Appointment(doctor, LocalDateTime.now().plusDays(1), AppointmentStatus.BOOKED);

        when(appointmentRepository.findById(eq(1L))).thenReturn(Optional.of(appointment));

        assertThrows(BadRequestException.class, () -> appointmentService.bookSlot(1L));
    }

    private void setAuth(User user) {
        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
