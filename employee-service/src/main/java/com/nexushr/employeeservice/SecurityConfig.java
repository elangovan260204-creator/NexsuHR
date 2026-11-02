package com.nexushr.employeeservice;

import jakarta.servlet.http.HttpServletResponse;
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

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/health").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/employees/me")
                    .hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/employees/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/attendance", "/api/attendance/**")
                    .hasAnyRole("ADMIN", "EMPLOYEE")

                .requestMatchers("/api/leaves", "/api/leaves/**")
                    .hasAnyRole("ADMIN", "EMPLOYEE")

                .requestMatchers("/api/performance", "/api/performance/**")
                    .hasAnyRole("ADMIN", "EMPLOYEE")

                .requestMatchers("/api/recruitment/**")
                    .hasRole("ADMIN")

                .requestMatchers(HttpMethod.GET, "/api/payroll/me", "/api/payroll/me/**")
                    .hasAnyRole("ADMIN", "EMPLOYEE")
                .requestMatchers("/api/payroll/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/ai-insights/**", "/api/ai/**")
                    .hasRole("ADMIN")

                .requestMatchers("/api/dashboard/**")
                    .hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Authentication required\"}");
                })
                .accessDeniedHandler((request, response, ex) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"message\":\"Access denied\"}");
                })
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
