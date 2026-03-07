package com.clinic.app.service;

import com.clinic.app.domain.Role;
import com.clinic.app.domain.User;
import com.clinic.app.dto.AuthRequest;
import com.clinic.app.dto.AuthResponse;
import com.clinic.app.dto.RegisterRequest;
import com.clinic.app.exception.BadRequestException;
import com.clinic.app.repository.UserRepository;
import com.clinic.app.security.JwtService;
import java.util.Map;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin registration is not allowed");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole());
        userRepository.save(user);

        // Include role claim for UI routing and authorization checks.
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name()));
        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        // Include role claim for UI routing and authorization checks.
        String token = jwtService.generateToken(user.getEmail(), Map.of("role", user.getRole().name()));
        return new AuthResponse(token, user.getRole().name(), user.getId(), user.getName());
    }
}
