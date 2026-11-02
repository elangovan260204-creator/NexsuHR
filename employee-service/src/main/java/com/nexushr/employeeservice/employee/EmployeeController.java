package com.nexushr.employeeservice.employee;

import com.nexushr.employeeservice.dto.EmployeeResponseDTO;
import com.nexushr.employeeservice.security.CurrentUserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final CurrentUserService currentUserService;

    public EmployeeController(
            EmployeeService employeeService,
            CurrentUserService currentUserService) {
        this.employeeService = employeeService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/me")
    public EmployeeResponseDTO getCurrentEmployee() {
        return employeeService.getEmployeeById(currentUserService.requireOwnEmployeeId());
    }

    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmployeeById(@NonNull @PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponseDTO addEmployee(@NonNull @Valid @RequestBody Employee employee) {
        return employeeService.addEmployee(employee);
    }

    @PutMapping("/{id}")
    public EmployeeResponseDTO updateEmployee(
            @NonNull @PathVariable Long id,
            @NonNull @Valid @RequestBody Employee employee) {
        return employeeService.updateEmployee(id, employee);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmployee(@NonNull @PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }

    @GetMapping
    public List<EmployeeResponseDTO> getAllEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String department) {
        return employeeService.getAllEmployees(search, department);
    }
}
