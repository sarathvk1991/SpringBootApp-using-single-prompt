package com.clinic.app.config;

import com.clinic.app.domain.Role;
import com.clinic.app.domain.User;
import com.clinic.app.repository.UserRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public ApplicationRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User admin = new User("Admin User", "admin@clinic.com", passwordEncoder.encode("Admin@123"), Role.ADMIN);
            User doctor = new User("Dr. Alice", "doctor@clinic.com", passwordEncoder.encode("Doctor@123"), Role.DOCTOR);
            User patient = new User("John Patient", "patient@clinic.com", passwordEncoder.encode("Patient@123"), Role.PATIENT);

            userRepository.save(admin);
            userRepository.save(doctor);
            userRepository.save(patient);
        };
    }
}
