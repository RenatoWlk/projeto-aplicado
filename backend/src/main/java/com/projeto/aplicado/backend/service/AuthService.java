package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.AuthRequest;
import com.projeto.aplicado.backend.dto.AuthResponse;
import com.projeto.aplicado.backend.model.UserBase;
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

    public AuthResponse authenticate(AuthRequest request) {
        UserBase user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new AuthResponse(token);
    }
}
