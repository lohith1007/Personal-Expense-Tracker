package com.example.expensetracker.service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.expensetracker.dto.AuthResponse;
import com.example.expensetracker.dto.ChangePasswordRequest;
import com.example.expensetracker.dto.LoginData;
import com.example.expensetracker.dto.ProfileResponse;
import com.example.expensetracker.dto.RegisterRequest;
import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.BadRequestException;
import com.example.expensetracker.exception.DuplicateResourceException;
import com.example.expensetracker.exception.InvalidCredentialsException;
import com.example.expensetracker.exception.ResourceNotFoundException;
import com.example.expensetracker.repository.UserRepository;
import com.example.expensetracker.security.JwtService;
import com.example.expensetracker.security.TokenBlacklist;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklist tokenBlacklist;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, TokenBlacklist tokenBlacklist) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenBlacklist = tokenBlacklist;
    }

    @Transactional
    public void register(RegisterRequest request) {
        String username = request.username().trim();
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("Username already exists");
        }
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginData data) {
        User user = userRepository.findByUsername(data.getUsername().trim());
        // Same message for "no such user" and "wrong password" so attackers cannot tell which usernames exist.
        if (user == null || !passwordEncoder.matches(data.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }
        return new AuthResponse(jwtService.generateToken(user), user.getUsername(), user.getEmail());
    }

    /** JWTs are stateless, so logout = tell the server to reject this token from now on. */
    public void logout(String tokenId, long tokenExpiresAt) {
        tokenBlacklist.revoke(tokenId, tokenExpiresAt);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Integer userId) {
        User user = findUser(userId);
        return new ProfileResponse(user.getId(), user.getUsername(), user.getEmail());
    }

    @Transactional
    public void changePassword(Integer userId, ChangePasswordRequest request) {
        User user = findUser(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (request.currentPassword().equals(request.newPassword())) {
            throw new BadRequestException("New password must be different from the current password");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    /** Deletes the user; JPA cascade removes that user's income and expenses too. */
    @Transactional
    public void deleteAccount(Integer userId, String password, String tokenId, long tokenExpiresAt) {
        User user = findUser(userId);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Password is incorrect");
        }
        userRepository.delete(user);
        tokenBlacklist.revoke(tokenId, tokenExpiresAt);
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
