package com.projeto.aplicado.backend.security;

import com.projeto.aplicado.backend.model.enums.Role;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String secret;

    /**
     * Generate a JWT token for the given user ID.
     * 
     * @param userId the user ID to include in the token
     * @param userName the user name to include in the token
     * @param email the user email to include in the token
     * @return the generated JWT token
     */
    public String generateToken(String userId, String userName, String email, Role role) {
        long EXPIRATION_TIME = 86400000; // 1 day
        return Jwts.builder()
                .setSubject(userId)
                .setSubject(userName)
                .setSubject(email)
                .setSubject(String.valueOf(role))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    /**
     * Extract the user ID from the given JWT token.
     * 
     * @param token the JWT token to extract the user ID from
     * @return the extracted user ID
     */
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Validate the given JWT token.
     * 
     * @param token the JWT token to validate
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Extract the expiration date from the given JWT token.
     * 
     * @param token the JWT token to extract the expiration date from
     * @return the extracted expiration date
     */
    private Claims getClaims(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
    }
}
