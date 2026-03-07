package com.clinic.app.service;

import com.clinic.app.dto.UserResponse;
import com.clinic.app.repository.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name()))
                .toList();
    }
}
