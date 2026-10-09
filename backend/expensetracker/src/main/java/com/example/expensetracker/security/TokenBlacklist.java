package com.example.expensetracker.security;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

/**
 * Remembers the ids (jti) of tokens revoked by logout, until they would have expired anyway.
 * JWTs are stateless, so this is what makes "logout" really invalidate the token on the server.
 * It lives in memory: restarting the backend clears it (acceptable for this project).
 */
@Component
public class TokenBlacklist {
    private final ConcurrentHashMap<String, Long> revoked = new ConcurrentHashMap<>();

    public void revoke(String tokenId, long expiresAt) {
        long now = Instant.now().getEpochSecond();
        revoked.entrySet().removeIf(entry -> entry.getValue() <= now); // forget tokens that expired
        revoked.put(tokenId, expiresAt);
    }

    public boolean isRevoked(String tokenId) {
        return revoked.containsKey(tokenId);
    }
}
