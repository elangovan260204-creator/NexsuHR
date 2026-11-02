
package com.nexushr.employeeservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Employee management: Admin only
                .requestMatchers("/api/employees/**")
                .hasRole("ADMIN")

                // Attendance: authenticated users for now
                .requestMatchers("/api/attendance/**")
                .hasAnyRole("ADMIN", "EMPLOYEE")

                // Leave management: authenticated users for now
                .requestMatchers("/api/leaves/**")
                .hasAnyRole("ADMIN", "EMPLOYEE")

                // Performance: authenticated users for now
                .requestMatchers("/api/performance/**")
                .hasAnyRole("ADMIN", "EMPLOYEE")

                // Recruitment: Admin only
                .requestMatchers("/api/recruitment/**")
                .hasRole("ADMIN")

                // Payroll: Admin only for now
                .requestMatchers("/api/payroll/**")
                .hasRole("ADMIN")

                // AI Insights: Admin only
                .requestMatchers("/api/ai-insights/**")
                .hasRole("ADMIN")

                // Everything else requires authentication
                .anyRequest().authenticated()
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
