package com.nexushr.employeeservice.security;

import com.nexushr.employeeservice.employee.Employee;
import com.nexushr.employeeservice.employee.EmployeeRepository;
import com.nexushr.employeeservice.exception.ForbiddenOperationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {

    private final EmployeeRepository employeeRepository;

    public CurrentUserService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public JwtUser requireUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ForbiddenOperationException("Authentication required");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof JwtUser jwtUser) {
            return jwtUser;
        }

        String username = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(RoleNames::normalize)
                .findFirst()
                .orElse(null);

        return new JwtUser(username, null, role);
    }

    public boolean isAdmin() {
        JwtUser user = requireUser();
        return RoleNames.ADMIN.equals(user.role());
    }

    public Employee requireLinkedEmployee() {
        JwtUser user = requireUser();
        if (user.email() == null || user.email().isBlank()) {
            throw new ForbiddenOperationException(
                    "This account is not linked to an employee profile. Sign in again after an administrator creates an employee record with your account email.");
        }

        return employeeRepository.findByEmailIgnoreCase(user.email().trim())
                .orElseThrow(() -> new ForbiddenOperationException(
                        "No employee profile is linked to this account email. Ask an administrator to create an employee record using "
                                + user.email()));
    }

    public Long requireOwnEmployeeId() {
        return requireLinkedEmployee().getId();
    }

    public Long findLinkedEmployeeId() {
        JwtUser user = requireUser();
        if (user.email() == null || user.email().isBlank()) {
            return null;
        }
        return employeeRepository.findByEmailIgnoreCase(user.email().trim())
                .map(Employee::getId)
                .orElse(null);
    }

    public Long resolveEmployeeId(Long requestedEmployeeId) {
        if (isAdmin()) {
            if (requestedEmployeeId == null) {
                throw new IllegalArgumentException("Employee ID is required");
            }
            return requestedEmployeeId;
        }

        Long ownId = requireOwnEmployeeId();
        if (requestedEmployeeId != null && !requestedEmployeeId.equals(ownId)) {
            throw new ForbiddenOperationException("You can only access your own records");
        }
        return ownId;
    }

    public void assertAdmin() {
        if (!isAdmin()) {
            throw new ForbiddenOperationException("Administrator access is required");
        }
    }

    public void assertCanAccessEmployee(Long employeeId) {
        resolveEmployeeId(employeeId);
    }
}
