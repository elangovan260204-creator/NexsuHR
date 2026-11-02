
package com.nexushr.authservice.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Component
public class EmployeePasswordResetInitializer implements CommandLineRunner {

    private final AppUserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public EmployeePasswordResetInitializer(
            AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {

        String newPassword =
                System.getenv("NEXUSHR_EMPLOYEE_RESET_PASSWORD");

        if (newPassword == null || newPassword.isBlank()) {
            return;
        }

        AppUser employee = userRepository
                .findByUsername("employee_test")
                .orElseThrow(() ->
                        new IllegalStateException(
                                "employee_test account not found"
                        )
                );

        if (!"EMPLOYEE".equalsIgnoreCase(employee.getRole())) {
            throw new IllegalStateException(
                    "Account is not an EMPLOYEE. Reset cancelled."
            );
        }

        employee.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(employee);

        System.out.println(
                "Employee password reset successfully!"
        );
    }
}
