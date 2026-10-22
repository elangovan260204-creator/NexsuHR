
package com.nexushr.authservice.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final AuthService authService;

    public RegisterController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @RequestBody RegisterRequest request) {

        AppUser user = authService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                "EMPLOYEE"
        );

        RegisterResponse response = new RegisterResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Registration successful"
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(
            IllegalArgumentException exception) {

        return ResponseEntity
                .badRequest()
                .body(exception.getMessage());
    }
}
