package com.example.expensetracker.security;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.expensetracker.entity.User;
import com.example.expensetracker.exception.UnauthorizedException;

import tools.jackson.databind.json.JsonMapper;

/**
 * Creates and verifies JSON Web Tokens signed with HMAC-SHA256 (HS256).
 *
 * Token = base64url(header) . base64url(payload) . base64url(signature)
 * The signature is HMAC(secret, header + "." + payload), so changing any character of the token
 * (for example the user id) makes verification fail.
 *
 * Implemented with the JDK only, because Spring Boot 4 uses Jackson 3 and the common jjwt library
 * expects Jackson 2.
 */
@Component
public class JwtService {
    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final String HEADER_JSON = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final byte[] secret;
    private final long ttlSeconds;
    private final JsonMapper mapper = JsonMapper.builder().build();
    private final String encodedHeader = ENCODER.encodeToString(HEADER_JSON.getBytes(StandardCharsets.UTF_8));

    public JwtService(@Value("${app.jwt.secret}") String secret,
                      @Value("${app.jwt.expiration-minutes:120}") long expirationMinutes) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("app.jwt.secret must be at least 32 characters long");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.ttlSeconds = expirationMinutes * 60;
    }

    public String generateToken(User user) {
        long now = Instant.now().getEpochSecond();
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", String.valueOf(user.getId()));
        payload.put("username", user.getUsername());
        payload.put("jti", UUID.randomUUID().toString());
        payload.put("iat", now);
        payload.put("exp", now + ttlSeconds);

        String encodedPayload = ENCODER.encodeToString(
                mapper.writeValueAsString(payload).getBytes(StandardCharsets.UTF_8));
        String unsigned = encodedHeader + "." + encodedPayload;
        return unsigned + "." + sign(unsigned);
    }

    /** Verifies signature and expiry. Throws UnauthorizedException for any problem. */
    public TokenClaims parse(String token) {
        try {
            String[] parts = token.split("\\.");
            if (parts.length != 3 || !parts[0].equals(encodedHeader)) {
                throw new UnauthorizedException("Invalid token");
            }
            String expectedSignature = sign(parts[0] + "." + parts[1]);
            // constant-time comparison so timing does not reveal the signature
            if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                    parts[2].getBytes(StandardCharsets.UTF_8))) {
                throw new UnauthorizedException("Invalid token");
            }
            String json = new String(DECODER.decode(parts[1]), StandardCharsets.UTF_8);
            Map<?, ?> payload = mapper.readValue(json, Map.class);

            long expiresAt = ((Number) payload.get("exp")).longValue();
            if (expiresAt <= Instant.now().getEpochSecond()) {
                throw new UnauthorizedException("Session expired. Please log in again.");
            }
            return new TokenClaims(
                    Integer.valueOf(String.valueOf(payload.get("sub"))),
                    String.valueOf(payload.get("username")),
                    String.valueOf(payload.get("jti")),
                    expiresAt);
        } catch (UnauthorizedException e) {
            throw e;
        } catch (RuntimeException e) {
            // malformed base64, malformed JSON, missing fields, ...
            throw new UnauthorizedException("Invalid token");
        }
    }

    private String sign(String data) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return ENCODER.encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("Could not sign token", e);
        }
    }
}
