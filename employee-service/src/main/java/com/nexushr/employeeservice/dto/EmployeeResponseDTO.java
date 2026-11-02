package com.nexushr.employeeservice.dto;

import java.time.LocalDate;

public class EmployeeResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String department;
    private String designation;
    private String phone;
    private String status;
    private LocalDate joiningDate;

    public EmployeeResponseDTO() {
    }

    public EmployeeResponseDTO(
            Long id,
            String name,
            String email,
            String department,
            String designation,
            String phone,
            String status,
            LocalDate joiningDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.designation = designation;
        this.phone = phone;
        this.status = status;
        this.joiningDate = joiningDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }
}
