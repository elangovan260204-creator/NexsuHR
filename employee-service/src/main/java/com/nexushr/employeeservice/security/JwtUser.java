package com.nexushr.employeeservice.security;

public record JwtUser(String username, String email, String role) {
}
