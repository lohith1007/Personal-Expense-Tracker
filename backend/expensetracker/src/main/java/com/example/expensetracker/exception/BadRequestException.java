package com.example.expensetracker.exception;

/** HTTP 400: request was understood but a business rule failed (e.g. wrong current password). */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
