package com.example.expensetracker.dto;

/** Returned by POST /login. The token must be sent as "Authorization: Bearer <token>". */
public record AuthResponse(String token, String username, String email) {
}
