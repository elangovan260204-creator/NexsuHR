
package com.nexushr.employeeservice;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;


import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Date;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    protected void doFilterInternal(
           @NonNull HttpServletRequest request,
           @NonNull HttpServletResponse response,
           @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String username = claims.getSubject();
            String role = claims.get("role", String.class);
            Date expiration = claims.getExpiration();

            if (username != null
                    && role != null
                    && expiration != null
                    && expiration.after(new Date())
                    && SecurityContextHolder.getContext()
                            .getAuthentication() == null) {

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role)
                                )
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
} catch (JwtException | IllegalArgumentException exception) {
    System.err.println(
        "JWT validation failed: " + exception.getClass().getSimpleName()
    );

    SecurityContextHolder.clearContext();

    response.sendError(
        HttpServletResponse.SC_UNAUTHORIZED,
        "Invalid or expired JWT token"
    );
    return;
}
filterChain.doFilter(request, response);
    }
}
