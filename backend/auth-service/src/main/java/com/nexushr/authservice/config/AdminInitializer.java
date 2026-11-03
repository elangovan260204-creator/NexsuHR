
package com.nexushr.authservice.config;

import com.nexushr.authservice.user.AppUser;
import com.nexushr.authservice.user.AppUserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    public CommandLineRunner initializeAdmin(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:}") String username,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.password:}") String password) {

        return args -> {

            // Normalize admin credentials
            String adminUsername = username.trim();
            String adminEmail = email.trim().toLowerCase();

            // Check whether admin credentials are configured
            if (adminUsername.isBlank()
                    || adminEmail.isBlank()
                    || password.isBlank()) {

                System.out.println(
                    "Admin initialization skipped: credentials not configured.");

                return;
            }

            // Check existing username
            if (userRepository.existsByUsername(adminUsername)) {

                System.out.println("Admin username already exists.");

                return;
            }

            // Check existing email
            if (userRepository.existsByEmail(adminEmail)) {

                System.out.println("Admin email already exists.");

                return;
            }

            // Validate admin password
            if (password.length() < 12) {

                throw new IllegalStateException(
                    "Admin password must contain at least 12 characters.");
            }

            // Create admin account
            AppUser admin = new AppUser();

            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole("ADMIN");

            // Save admin account
            userRepository.save(admin);

            System.out.println(
                "Initial Admin account created successfully.");
        };
    }
}
    