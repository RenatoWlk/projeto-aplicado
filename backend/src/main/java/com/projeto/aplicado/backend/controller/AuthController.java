package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.auth.AuthRequest;
import com.projeto.aplicado.backend.dto.auth.AuthResponse;
import com.projeto.aplicado.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    /**
     * Handles user login requests.
     * This endpoint accepts a POST request with user credentials in the request body.
     * 
     * @param request The authentication request containing user credentials.
     * @return A ResponseEntity containing the authentication response with user details and token.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}
