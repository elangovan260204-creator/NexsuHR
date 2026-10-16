package com.nexushr.backend.dto;
public class EmployeeResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String department;
    private String designation;

    public EmployeeResponseDTO(
            Long id,
            String name,
            String email,
            String department,
            String designation) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.designation = designation;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getDepartment() {
        return department;
    }

    public String getDesignation() {
        return designation;
    }
}
