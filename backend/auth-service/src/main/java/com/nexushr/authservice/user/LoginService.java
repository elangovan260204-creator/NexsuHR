
package com.nexushr.authservice.user;

import com.nexushr.authservice.config.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(String username, String rawPassword) {

        if (username == null || username.isBlank()
                || rawPassword == null || rawPassword.isBlank()) {
            throw new BadCredentialsException("Invalid username or password");
        }

        AppUser user = userRepository.findByUsername(username.trim())
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }

        String role = JwtService.normalizeRole(user.getRole());
        String token = jwtService.generateToken(
                user.getUsername(),
                role,
                user.getEmail()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                role,
                "Login successful"
        );
    }
}
