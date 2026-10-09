package com.example.expensetracker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.dto.AuthResponse;
import com.example.expensetracker.dto.ChangePasswordRequest;
import com.example.expensetracker.dto.DeleteAccountRequest;
import com.example.expensetracker.dto.LoginData;
import com.example.expensetracker.dto.MessageResponse;
import com.example.expensetracker.dto.ProfileResponse;
import com.example.expensetracker.dto.RegisterRequest;
import com.example.expensetracker.security.JwtAuthInterceptor;
import com.example.expensetracker.service.UserService;

import jakarta.validation.Valid;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ---------- public endpoints (no token needed) ----------

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginData data) {
        return ResponseEntity.ok(userService.login(data));
    }

    // ---------- protected endpoints (valid JWT required) ----------

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @RequestAttribute(JwtAuthInterceptor.ATTR_TOKEN_ID) String tokenId,
            @RequestAttribute(JwtAuthInterceptor.ATTR_TOKEN_EXPIRES_AT) Long tokenExpiresAt) {
        userService.logout(tokenId, tokenExpiresAt);
        return ResponseEntity.ok(new MessageResponse("Logged out successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile/password")
    public ResponseEntity<MessageResponse> changePassword(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request);
        return ResponseEntity.ok(new MessageResponse("Password updated successfully"));
    }

    @DeleteMapping("/profile")
    public ResponseEntity<MessageResponse> deleteAccount(
            @RequestAttribute(JwtAuthInterceptor.ATTR_USER_ID) Integer userId,
            @RequestAttribute(JwtAuthInterceptor.ATTR_TOKEN_ID) String tokenId,
            @RequestAttribute(JwtAuthInterceptor.ATTR_TOKEN_EXPIRES_AT) Long tokenExpiresAt,
            @Valid @RequestBody DeleteAccountRequest request) {
        userService.deleteAccount(userId, request.password(), tokenId, tokenExpiresAt);
        return ResponseEntity.ok(new MessageResponse("Account deleted successfully"));
    }
}
