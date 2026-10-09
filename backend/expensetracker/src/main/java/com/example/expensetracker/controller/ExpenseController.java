package com.example.expensetracker.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.dto.ExpenseRequest;
import com.example.expensetracker.dto.ExpenseResponse;
import com.example.expensetracker.security.JwtAuthInterceptor;
import com.example.expensetracker.service.ExpenseService;

import jakarta.validation.Valid;

@RestController
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/expense")
    public ResponseEntity<ExpenseResponse> addExpense(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.addExpense(userId, request));
    }

    @GetMapping("/expenses")
    public ResponseEntity<List<ExpenseResponse>> getAllExpenses(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId) {
        return ResponseEntity.ok(expenseService.getAllExpenses(userId));
    }

    @GetMapping("/expense/{id}")
    public ResponseEntity<ExpenseResponse> getExpense(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @PathVariable Integer id) {
        return ResponseEntity.ok(expenseService.getExpense(userId, id));
    }

    @PutMapping("/expense/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @PathVariable Integer id,
            @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(userId, id, request));
    }

    @DeleteMapping("/expense/{id}")
    public ResponseEntity<Void> deleteExpense(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @PathVariable Integer id) {
        expenseService.deleteExpense(userId, id);
        return ResponseEntity.noContent().build();
    }
}
