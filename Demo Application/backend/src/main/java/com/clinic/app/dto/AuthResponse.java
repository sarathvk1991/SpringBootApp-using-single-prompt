package com.clinic.app.dto;

public class AuthResponse {
    private final String token;
    private final String role;
    private final Long userId;
    private final String name;

    public AuthResponse(String token, String role, Long userId, String name) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }
}
