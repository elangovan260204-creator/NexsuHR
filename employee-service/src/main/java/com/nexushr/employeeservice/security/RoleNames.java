package com.nexushr.employeeservice.security;

import java.util.Locale;

public final class RoleNames {

    public static final String ADMIN = "ADMIN";
    public static final String EMPLOYEE = "EMPLOYEE";

    private RoleNames() {
    }

    public static String normalize(String role) {
        if (role == null || role.isBlank()) {
            return null;
        }

        String normalized = role.trim();
        if (normalized.regionMatches(true, 0, "ROLE_", 0, 5)) {
            normalized = normalized.substring(5);
        }

        return normalized.toUpperCase(Locale.ROOT);
    }
}
