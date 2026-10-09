package com.example.expensetracker.exception;

/** HTTP 401: wrong username or password at login. */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException(String message) {
        super(message);
    }
}
