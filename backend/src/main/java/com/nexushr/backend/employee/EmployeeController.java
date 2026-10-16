
package com.nexushr.backend.employee;

import com.nexushr.backend.dto.EmployeeResponseDTO;
import jakarta.validation.Valid;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

   
@GetMapping("/{id}")
public EmployeeResponseDTO getEmployeeById(
        @NonNull @PathVariable Long id) {
    return employeeService.getEmployeeById(id);
}

@PostMapping
public EmployeeResponseDTO addEmployee(
        @NonNull @Valid @RequestBody Employee employee) {
    return employeeService.addEmployee(employee);
}

@PutMapping("/{id}")
public EmployeeResponseDTO updateEmployee(
        @NonNull @PathVariable Long id,
        @NonNull @Valid @RequestBody Employee employee) {
    return employeeService.updateEmployee(id, employee);
}


    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable @NonNull Long id) {
        employeeService.deleteEmployee(id);
        return "Employee deleted successfully. ID: " + id;
    }
}
