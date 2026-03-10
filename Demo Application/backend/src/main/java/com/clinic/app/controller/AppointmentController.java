package com.clinic.app.controller;

import com.clinic.app.dto.AppointmentCreateRequest;
import com.clinic.app.dto.AppointmentRescheduleRequest;
import com.clinic.app.dto.AppointmentResponse;
import com.clinic.app.service.AppointmentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/slots")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<AppointmentResponse> createSlot(@Valid @RequestBody AppointmentCreateRequest request) {
        return ResponseEntity.ok(appointmentService.createSlot(request));
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentResponse>> getAvailableSlots() {
        return ResponseEntity.ok(appointmentService.getAvailableSlots());
    }

    @PostMapping("/{id}/book")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> bookSlot(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appointmentService.bookSlot(id));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> cancelAppointment(@PathVariable("id") Long id) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id));
    }

    @PostMapping("/{id}/reschedule")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<AppointmentResponse> rescheduleAppointment(
            @PathVariable("id") Long id,
            @Valid @RequestBody AppointmentRescheduleRequest request) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, request.getNewSlotId()));
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments() {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments());
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments() {
        return ResponseEntity.ok(appointmentService.getPatientAppointments());
    }
}
