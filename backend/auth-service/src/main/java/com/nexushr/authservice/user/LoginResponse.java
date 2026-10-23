
package com.nexushr.authservice.user;

public class LoginResponse {

    private String token;
    private String tokenType;
    private Long userId;
    private String username;
    private String role;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            Long userId,
            String username,
            String role,
            String message) {
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getMessage() {
        return message;
    }
}
