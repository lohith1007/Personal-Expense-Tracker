package com.example.expensetracker.dto;

/** Profile details. The password is intentionally NOT included. */
public record ProfileResponse(Integer id, String username, String email) {
}
