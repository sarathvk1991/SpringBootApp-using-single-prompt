package com.clinic.app.dto;

import jakarta.validation.constraints.NotNull;

public class AppointmentRescheduleRequest {
    @NotNull
    private Long newSlotId;

    public Long getNewSlotId() {
        return newSlotId;
    }

    public void setNewSlotId(Long newSlotId) {
        this.newSlotId = newSlotId;
    }
}
