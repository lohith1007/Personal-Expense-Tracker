package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

/** Body of POST /income and PUT /income/{id}. There is deliberately no userId field. */
public record IncomeRequest(
        @NotBlank(message = "Income source is required")
        @Size(max = 100, message = "Income source must be at most 100 characters")
        String source,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
        @Digits(integer = 10, fraction = 2, message = "Amount can have up to 10 digits and 2 decimal places")
        BigDecimal amount,

        @NotNull(message = "Date is required")
        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate date) {
}
