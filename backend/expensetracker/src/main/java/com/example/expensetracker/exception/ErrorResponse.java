package com.example.expensetracker.exception;

import java.time.Instant;
import java.util.Map;

/** JSON shape of every error: {timestamp, status, error, message, errors{field: message}}. */
public record ErrorResponse(Instant timestamp, int status, String error, String message,
                            Map<String, String> errors) {
}
