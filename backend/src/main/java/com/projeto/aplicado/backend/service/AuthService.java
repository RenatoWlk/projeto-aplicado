package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.auth.AuthRequest;
import com.projeto.aplicado.backend.dto.auth.AuthResponse;
import com.projeto.aplicado.backend.model.users.UserBase;
import com.projeto.aplicado.backend.repository.UserRepository;
import com.projeto.aplicado.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user by validating their credentials and generating a JWT token.
     * 
     * @param request The authentication request containing the user's email and password.
     * @return An AuthResponse containing the generated JWT token.
     */
    public AuthResponse authenticate(AuthRequest request) {
        UserBase user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException(Messages.INVALID_CREDENTIALS);
        }

        String token = jwtUtil.generateToken(user.getId());
        return new AuthResponse(token);
    }
}
