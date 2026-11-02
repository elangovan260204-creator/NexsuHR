package com.nexushr.authservice.user;

import com.nexushr.authservice.config.JwtService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class MeController {

    private final AppUserRepository appUserRepository;

    public MeController(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @GetMapping("/me")
    public Map<String, String> getCurrentUser(Authentication authentication) {
        AppUser user = appUserRepository.findByUsername(authentication.getName())
                .orElseThrow();

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(JwtService::normalizeRole)
                .findFirst()
                .orElse(user.getRole());

        return Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", role,
                "message", "JWT authentication successful"
        );
    }
}
