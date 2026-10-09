package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

/** Body of POST /expense and PUT /expense/{id}. There is deliberately no userId field. */
public record ExpenseRequest(
        @NotBlank(message = "Expense category is required")
        @Size(max = 100, message = "Category must be at most 100 characters")
        String category,

        @Size(max = 255, message = "Description must be at most 255 characters")
        String description,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        @Digits(integer = 10, fraction = 2, message = "Amount can have up to 10 digits and 2 decimal places")
        BigDecimal amount,

        @NotNull(message = "Date is required")
        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate date) {
}
