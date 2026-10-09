package com.example.expensetracker.security;

/** The values read from a verified JWT. expiresAt is in epoch seconds. */
public record TokenClaims(Integer userId, String username, String tokenId, long expiresAt) {
}
