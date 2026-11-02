
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

            if (username.isBlank()
                    || email.isBlank()
                    || password.isBlank()) {
                System.out.println(
                    "Admin initialization skipped: credentials not configured.");
                return;
            }

            if (userRepository.existsByUsername(username)) {
                System.out.println("Admin username already exists.");
                return;
            }

            if (userRepository.existsByEmail(email)) {
                System.out.println("Admin email already exists.");
                return;
            }

            if (password.length() < 12) {
                throw new IllegalStateException(
                    "Admin password must contain at least 12 characters.");
            }

            AppUser admin = new AppUser();
            admin.setUsername(username.trim());
            admin.setEmail(email.trim().toLowerCase());
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole("ADMIN");

            userRepository.save(admin);

            System.out.println("Initial Admin account created successfully.");
        };
    }
}
