
package com.nexushr.authservice.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

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

        if (userRepository.existsByUsername(username.trim())) {
            throw new IllegalArgumentException(
                    "Username already exists");
        }

        if (userRepository.existsByEmail(email.trim())) {
            throw new IllegalArgumentException(
                    "Email already exists");
        }

        if (role == null || !role.matches("ADMIN|EMPLOYEE")) {
            throw new IllegalArgumentException(
                    "Role must be ADMIN or EMPLOYEE");
        }

        AppUser user = new AppUser();
        user.setUsername(username.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);

        return userRepository.save(user);
    }
}
