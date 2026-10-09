package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.expensetracker.entity.Expense;

public record ExpenseResponse(Integer id, String category, String description, BigDecimal amount, LocalDate date) {

    public static ExpenseResponse from(Expense expense) {
        return new ExpenseResponse(expense.getId(), expense.getCategory(), expense.getDescription(),
                expense.getAmount(), expense.getDate());
    }
}
