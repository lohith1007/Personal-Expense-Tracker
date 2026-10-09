package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** One row of the dashboard "recent transactions" list. type is "INCOME" or "EXPENSE". */
public record TransactionResponse(Integer id, String type, String title, String description,
                                  BigDecimal amount, LocalDate date) {
}
