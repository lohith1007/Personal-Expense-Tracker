package com.example.expensetracker.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Base64;

import org.junit.jupiter.api.Test;

import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.UnauthorizedException;

/** Plain unit test: no Spring context and no MySQL needed. */
class JwtServiceTest {
    private static final String SECRET = "unit-test-secret-unit-test-secret-1234";

    private final JwtService jwtService = new JwtService(SECRET, 60);
    private final User user = new User(7, "alice", "alice@example.com", "hash");

    @Test
    void validTokenReturnsTheUserFromTheToken() {
        TokenClaims claims = jwtService.parse(jwtService.generateToken(user));
        assertEquals(7, claims.userId());
        assertEquals("alice", claims.username());
    }

    @Test
    void everyTokenHasItsOwnId() {
        assertNotEquals(jwtService.generateToken(user), jwtService.generateToken(user));
    }

    @Test
    void tamperedPayloadIsRejected() {
        String[] parts = jwtService.generateToken(user).split("\\.");
        String payload = new String(Base64.getUrlDecoder().decode(parts[1]))
                .replace("\"sub\":\"7\"", "\"sub\":\"8\"");
        String forged = parts[0] + "."
                + Base64.getUrlEncoder().withoutPadding().encodeToString(payload.getBytes()) + "." + parts[2];
        assertThrows(UnauthorizedException.class, () -> jwtService.parse(forged));
    }

    @Test
    void tokenSignedWithAnotherSecretIsRejected() {
        String token = new JwtService("another-secret-another-secret-123456", 60).generateToken(user);
        assertThrows(UnauthorizedException.class, () -> jwtService.parse(token));
    }

    @Test
    void expiredTokenIsRejected() {
        String token = new JwtService(SECRET, -1).generateToken(user);
        assertThrows(UnauthorizedException.class, () -> jwtService.parse(token));
    }

    @Test
    void garbageIsRejected() {
        assertThrows(UnauthorizedException.class, () -> jwtService.parse("not-a-token"));
    }

    @Test
    void shortSecretIsRefused() {
        assertThrows(IllegalStateException.class, () -> new JwtService("short", 60));
    }
}
