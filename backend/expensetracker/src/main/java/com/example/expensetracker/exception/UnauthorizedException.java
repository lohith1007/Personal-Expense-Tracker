package com.example.expensetracker.exception;

/** HTTP 401: missing, invalid, expired or revoked JWT. */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
