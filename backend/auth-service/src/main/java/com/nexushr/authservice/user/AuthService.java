
package com.nexushr.authservice.user;

import com.nexushr.authservice.config.JwtService;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    // Employee Registration
    @Transactional
    public AppUser register(
            String username,
            String email,
            String rawPassword,
            String role) {

        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException(
                    "Username is required");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required");
        }

        if (rawPassword == null || rawPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "Password must contain at least 8 characters");
        }

        String normalizedUsername = username.trim();
        String normalizedEmail = email.trim().toLowerCase();

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException(
                    "Username already exists");
        }

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "Email already exists");
        }

        String normalizedRole = JwtService.normalizeRole(role);

        if (!"EMPLOYEE".equals(normalizedRole)) {
            throw new IllegalArgumentException(
                    "Self-registration is limited to the EMPLOYEE role");
        }

        if (!employeeProfileExists(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "No employee profile found for this email. Ask an administrator to create your employee record first.");
        }

        AppUser user = new AppUser();

        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole("EMPLOYEE");

        return userRepository.save(user);
    }

    // Create Employee Login
    @Transactional
    public AppUser createEmployeeLogin(
            String username,
            String email,
            String rawPassword) {

        return register(
                username,
                email,
                rawPassword,
                "EMPLOYEE");
    }

    // Change Password
    @Transactional
    public void changePassword(
            String username,
            String currentPassword,
            String newPassword) {

        if (currentPassword == null || currentPassword.isBlank()) {
            throw new IllegalArgumentException(
                    "Current password is required");
        }

        if (newPassword == null || newPassword.length() < 8) {
            throw new IllegalArgumentException(
                    "New password must contain at least 8 characters");
        }

        if (currentPassword.equals(newPassword)) {
            throw new IllegalArgumentException(
                    "New password must be different from current password");
        }

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(
                currentPassword,
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    // Admin Reset Password
    @Transactional
    public void adminResetPassword(
            String username,
            String newPassword) {

        if (newPassword == null || newPassword.length() < 12) {
            throw new IllegalArgumentException(
                    "Admin reset password must contain at least 12 characters");
        }

        AppUser user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    // Verify Employee Profile
    private boolean employeeProfileExists(String email) {

        try {

            Integer count = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM employee WHERE LOWER(email) = LOWER(?)",
                    Integer.class,
                    email);

            return count != null && count > 0;

        } catch (Exception exception) {

            throw new IllegalArgumentException(
                    "Unable to verify employee profile. Try again or ask an administrator for help.");
        }
    }
}
