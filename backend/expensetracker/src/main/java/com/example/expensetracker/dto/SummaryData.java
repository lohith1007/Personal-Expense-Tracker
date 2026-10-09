package com.example.expensetracker.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/** Dashboard data for the logged-in user. balance = totalIncome - totalExpense. */
public class SummaryData {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<TransactionResponse> recentTransactions;
    private Map<String, BigDecimal> expenseByCategory;

    public SummaryData() {
    }

    public SummaryData(BigDecimal totalIncome, BigDecimal totalExpense, BigDecimal balance,
                       List<TransactionResponse> recentTransactions,
                       Map<String, BigDecimal> expenseByCategory) {
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.recentTransactions = recentTransactions;
        this.expenseByCategory = expenseByCategory;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public List<TransactionResponse> getRecentTransactions() {
        return recentTransactions;
    }

    public void setRecentTransactions(List<TransactionResponse> recentTransactions) {
        this.recentTransactions = recentTransactions;
    }

    public Map<String, BigDecimal> getExpenseByCategory() {
        return expenseByCategory;
    }

    public void setExpenseByCategory(Map<String, BigDecimal> expenseByCategory) {
        this.expenseByCategory = expenseByCategory;
    }
}
