package com.example.expensetracker.security;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.expensetracker.exception.UnauthorizedException;
import com.example.expensetracker.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Runs before every protected controller method (see WebConfig for which paths).
 * It reads "Authorization: Bearer <token>", verifies it, and stores the user id taken FROM THE TOKEN
 * in a request attribute. Controllers read the user id only from there, never from the request body,
 * the URL or a query parameter.
 */
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {
    public static final String ATTR_USER_ID = "authUserId";
    public static final String ATTR_TOKEN_ID = "authTokenId";
    public static final String ATTR_TOKEN_EXPIRES_AT = "authTokenExpiresAt";

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final TokenBlacklist tokenBlacklist;
    private final UserRepository userRepository;

    public JwtAuthInterceptor(JwtService jwtService, TokenBlacklist tokenBlacklist, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.tokenBlacklist = tokenBlacklist;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // Browser CORS preflight requests carry no token.
        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            throw new UnauthorizedException("Authentication required. Please log in.");
        }

        TokenClaims claims = jwtService.parse(header.substring(BEARER_PREFIX.length()).trim());

        if (tokenBlacklist.isRevoked(claims.tokenId())) {
            throw new UnauthorizedException("You have been logged out. Please log in again.");
        }
        // A deleted account's token must stop working immediately.
        if (!userRepository.existsById(claims.userId())) {
            throw new UnauthorizedException("Account no longer exists.");
        }

        request.setAttribute(ATTR_USER_ID, claims.userId());
        request.setAttribute(ATTR_TOKEN_ID, claims.tokenId());
        request.setAttribute(ATTR_TOKEN_EXPIRES_AT, claims.expiresAt());
        return true;
    }
}
