
package com.nexushr.employeeservice.employee;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import com.nexushr.employeeservice.dto.EmployeeResponseDTO;
import com.nexushr.employeeservice.exception.EmployeeNotFoundException;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public EmployeeResponseDTO getEmployeeById(@NonNull Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee not found with ID: " + id));

        return convertToDTO(employee);
    }

   public EmployeeResponseDTO addEmployee(@NonNull Employee employee) {
    Employee savedEmployee = employeeRepository.save(employee);
    return convertToDTO(savedEmployee);

    }

    public EmployeeResponseDTO updateEmployee( @NonNull Long id,
        @NonNull Employee updatedEmployee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new EmployeeNotFoundException(
                        "Employee not found with ID: " + id));

        existingEmployee.setName(updatedEmployee.getName());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setDepartment(updatedEmployee.getDepartment());
        existingEmployee.setDesignation(updatedEmployee.getDesignation());

        Employee savedEmployee = employeeRepository.save(existingEmployee);
        return convertToDTO(savedEmployee);
    }

    
public void deleteEmployee(@NonNull Long id) {
    employeeRepository.findById(id)
            .orElseThrow(() -> new EmployeeNotFoundException(
                    "Employee not found with ID: " + id
            ));
    employeeRepository.deleteById(id);
}


    private EmployeeResponseDTO convertToDTO(Employee employee) {
        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getDepartment(),
                employee.getDesignation());
    }
    



}




