package com.example.expensetracker.exception;

/** HTTP 409: username or email already registered. */
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
