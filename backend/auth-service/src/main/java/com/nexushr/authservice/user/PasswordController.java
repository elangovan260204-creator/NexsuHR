package com.nexushr.authservice.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordController {

    private final AuthService authService;

    public PasswordController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {
        authService.changePassword(
                authentication.getName(),
                request.getCurrentPassword(),
                request.getNewPassword());
        return Map.of("message", "Password updated successfully");
    }

    @PutMapping("/admin/users/{username}/password")
    public Map<String, String> adminResetPassword(
            @org.springframework.web.bind.annotation.PathVariable String username,
            @RequestBody Map<String, String> request) {
        authService.adminResetPassword(username, request.get("newPassword"));
        return Map.of("message", "Password reset successfully");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(
            IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
