package com.projeto.aplicado.backend.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
