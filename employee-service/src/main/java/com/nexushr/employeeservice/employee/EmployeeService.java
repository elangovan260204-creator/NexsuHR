package com.nexushr.employeeservice.employee;

import com.nexushr.employeeservice.dto.EmployeeResponseDTO;
import com.nexushr.employeeservice.exception.ConflictException;
import com.nexushr.employeeservice.exception.EmployeeNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeResponseDTO> getAllEmployees(String search, String department) {
        List<Employee> employees = department == null || department.isBlank()
                ? employeeRepository.findAll()
                : employeeRepository.findByDepartmentIgnoreCase(department.trim());

        String query = search == null ? "" : search.trim().toLowerCase(Locale.ROOT);

        return employees.stream()
                .filter(employee -> matchesSearch(employee, query))
                .map(this::convertToDTO)
                .toList();
    }

    public EmployeeResponseDTO getEmployeeById(@NonNull Long id) {
        return convertToDTO(findEmployee(id));
    }

    @Transactional
    public EmployeeResponseDTO addEmployee(@NonNull Employee employee) {
        validateEmployee(employee);

        if (employeeRepository.existsByEmailIgnoreCase(employee.getEmail().trim())) {
            throw new ConflictException("An employee with this email already exists");
        }

        employee.setId(null);
        employee.setEmail(employee.getEmail().trim().toLowerCase(Locale.ROOT));
        employee.setName(employee.getName().trim());
        normalizeOptionalFields(employee);
        if (employee.getStatus() == null || employee.getStatus().isBlank()) {
            employee.setStatus("ACTIVE");
        }

        return convertToDTO(employeeRepository.save(employee));
    }

    @Transactional
    public EmployeeResponseDTO updateEmployee(
            @NonNull Long id,
            @NonNull Employee updatedEmployee) {
        validateEmployee(updatedEmployee);

        Employee existingEmployee = findEmployee(id);
        String newEmail = updatedEmployee.getEmail().trim().toLowerCase(Locale.ROOT);

        employeeRepository.findByEmailIgnoreCase(newEmail)
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new ConflictException("An employee with this email already exists");
                });

        existingEmployee.setName(updatedEmployee.getName().trim());
        existingEmployee.setEmail(newEmail);
        existingEmployee.setDepartment(updatedEmployee.getDepartment());
        existingEmployee.setDesignation(updatedEmployee.getDesignation());
        existingEmployee.setPhone(updatedEmployee.getPhone());
        existingEmployee.setJoiningDate(updatedEmployee.getJoiningDate());
        if (updatedEmployee.getStatus() != null && !updatedEmployee.getStatus().isBlank()) {
            existingEmployee.setStatus(normalizeStatus(updatedEmployee.getStatus()));
        }
        normalizeOptionalFields(existingEmployee);

        return convertToDTO(employeeRepository.save(existingEmployee));
    }

    @Transactional
    public void deleteEmployee(@NonNull Long id) {
        findEmployee(id);
        employeeRepository.deleteById(id);
    }

    private Employee findEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee not found with ID: " + id));
    }

    private void validateEmployee(Employee employee) {
        if (employee.getName() == null || employee.getName().isBlank()) {
            throw new IllegalArgumentException("Employee name is required");
        }
        if (employee.getEmail() == null || employee.getEmail().isBlank()) {
            throw new IllegalArgumentException("Employee email is required");
        }
        if (employee.getStatus() != null && !employee.getStatus().isBlank()) {
            employee.setStatus(normalizeStatus(employee.getStatus()));
        }
    }

    private String normalizeStatus(String status) {
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        if (!List.of("ACTIVE", "INACTIVE", "ON_LEAVE").contains(normalized)) {
            throw new IllegalArgumentException("Status must be ACTIVE, INACTIVE, or ON_LEAVE");
        }
        return normalized;
    }

    private void normalizeOptionalFields(Employee employee) {
        if (employee.getDepartment() != null) {
            employee.setDepartment(employee.getDepartment().trim());
        }
        if (employee.getDesignation() != null) {
            employee.setDesignation(employee.getDesignation().trim());
        }
        if (employee.getPhone() != null) {
            employee.setPhone(employee.getPhone().trim());
        }
    }

    private boolean matchesSearch(Employee employee, String query) {
        if (query.isBlank()) {
            return true;
        }
        return contains(employee.getName(), query)
                || contains(employee.getEmail(), query)
                || contains(employee.getDepartment(), query)
                || contains(employee.getDesignation(), query);
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }

    private EmployeeResponseDTO convertToDTO(Employee employee) {
        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getPhone(),
                employee.getStatus(),
                employee.getJoiningDate());
    }
}
