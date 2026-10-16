
package com.nexushr.employeeservice.employee;

//import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.lang.NonNull;
import java.util.List;
import com.nexushr.employeeservice.dto.EmployeeResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

   
@GetMapping("/{id}")
public EmployeeResponseDTO getEmployeeById(
        @NonNull @PathVariable Long id) {
    return employeeService.getEmployeeById(id);
}

@PostMapping
@ResponseStatus(HttpStatus.CREATED)
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
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteEmployee(@NonNull @PathVariable Long id) {
    employeeService.deleteEmployee(id);
}

@GetMapping
public List<EmployeeResponseDTO> getAllEmployees() {
    return employeeService.getAllEmployees();
}
}
