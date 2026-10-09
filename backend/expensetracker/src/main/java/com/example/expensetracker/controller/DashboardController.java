package com.example.expensetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.dto.SummaryData;
import com.example.expensetracker.security.JwtAuthInterceptor;
import com.example.expensetracker.service.DashboardService;

@RestController
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<SummaryData> getSummary(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId) {
        return ResponseEntity.ok(dashboardService.getSummary(userId));
    }
}
