package com.example.expensetracker.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.expensetracker.dto.SummaryData;
import com.example.expensetracker.dto.TransactionResponse;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.IncomeRepository;

/** Builds the dashboard numbers from the database. Nothing here is hardcoded. */
@Service
public class DashboardService {
    private static final int RECENT_LIMIT = 5;

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;

    public DashboardService(IncomeRepository incomeRepository, ExpenseRepository expenseRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
    }

    @Transactional(readOnly = true)
    public SummaryData getSummary(Integer userId) {
        BigDecimal totalIncome = money(incomeRepository.sumAmountByUserId(userId));
        BigDecimal totalExpense = money(expenseRepository.sumAmountByUserId(userId));
        BigDecimal balance = totalIncome.subtract(totalExpense);

        List<TransactionResponse> recent = new ArrayList<>();
        incomeRepository.findTop5ByUserIdOrderByDateDescIdDesc(userId).forEach(i ->
                recent.add(new TransactionResponse(i.getId(), "INCOME", i.getSource(), null,
                        i.getAmount(), i.getDate())));
        expenseRepository.findTop5ByUserIdOrderByDateDescIdDesc(userId).forEach(e ->
                recent.add(new TransactionResponse(e.getId(), "EXPENSE", e.getCategory(), e.getDescription(),
                        e.getAmount(), e.getDate())));
        recent.sort(Comparator.comparing(TransactionResponse::date).reversed()
                .thenComparing(TransactionResponse::id, Comparator.reverseOrder()));
        List<TransactionResponse> recentTransactions = recent.size() > RECENT_LIMIT
                ? new ArrayList<>(recent.subList(0, RECENT_LIMIT))
                : recent;

        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        for (Object[] row : expenseRepository.sumAmountByCategory(userId)) {
            byCategory.put((String) row[0], money((BigDecimal) row[1]));
        }

        return new SummaryData(totalIncome, totalExpense, balance, recentTransactions, byCategory);
    }

    private BigDecimal money(BigDecimal value) {
        return (value == null ? BigDecimal.ZERO : value).setScale(2, java.math.RoundingMode.HALF_UP);
    }
}
