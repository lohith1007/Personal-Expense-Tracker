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

import com.example.expensetracker.dto.IncomeRequest;
import com.example.expensetracker.dto.IncomeResponse;
import com.example.expensetracker.security.JwtAuthInterceptor;
import com.example.expensetracker.service.IncomeService;

import jakarta.validation.Valid;

@RestController
public class IncomeController {
    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping("/income")
    public ResponseEntity<IncomeResponse> addIncome(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @Valid @RequestBody IncomeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(incomeService.addIncome(userId, request));
    }

    @GetMapping("/incomes")
    public ResponseEntity<List<IncomeResponse>> getAllIncome(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId) {
        return ResponseEntity.ok(incomeService.getAllIncomes(userId));
    }

    @GetMapping("/income/{id}")
    public ResponseEntity<IncomeResponse> getIncome(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @PathVariable Integer id) {
        return ResponseEntity.ok(incomeService.getIncome(userId, id));
    }

    @PutMapping("/income/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @PathVariable Integer id,
            @Valid @RequestBody IncomeRequest request) {
        return ResponseEntity.ok(incomeService.updateIncome(userId, id, request));
    }

    @DeleteMapping("/income/{id}")
    public ResponseEntity<Void> deleteIncome(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @PathVariable Integer id) {
        incomeService.deleteIncome(userId, id);
        return ResponseEntity.noContent().build();
    }
}
