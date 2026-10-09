package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.expensetracker.entity.Income;

public record IncomeResponse(Integer id, String source, BigDecimal amount, LocalDate date) {

    public static IncomeResponse from(Income income) {
        return new IncomeResponse(income.getId(), income.getSource(), income.getAmount(), income.getDate());
    }
}
