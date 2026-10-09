package com.example.expensetracker.exception;

/** HTTP 404. Also used when a record exists but belongs to another user (so ownership is not leaked). */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
