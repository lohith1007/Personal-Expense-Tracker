package com.example.expensetracker.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UserRepository;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ExpenseResponse addExpense(Integer userId, ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setUser(userRepository.getReferenceById(userId));
        apply(expense, request);
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses(Integer userId) {
        return expenseRepository.findByUserIdOrderByDateDescIdDesc(userId)
                .stream()
                .map(ExpenseResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpense(Integer userId, Integer id) {
        return ExpenseResponse.from(findOwned(userId, id));
    }

    @Transactional
    public ExpenseResponse updateExpense(Integer userId, Integer id, ExpenseRequest request) {
        Expense expense = findOwned(userId, id);
        apply(expense, request);
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    @Transactional
    public void deleteExpense(Integer userId, Integer id) {
        expenseRepository.delete(findOwned(userId, id));
    }

    // Looks the row up by BOTH id and owner. Someone else's row looks exactly like a missing row.
    private Expense findOwned(Integer userId, Integer id) {
        return expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
    }

    private void apply(Expense expense, ExpenseRequest request) {
        expense.setCategory(request.category().trim());
        String description = request.description() == null ? "" : request.description().trim();
        expense.setDescription(description.isEmpty() ? null : description);
        expense.setAmount(request.amount());
        expense.setDate(request.date());
    }
}
