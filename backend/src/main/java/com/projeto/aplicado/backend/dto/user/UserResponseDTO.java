package com.projeto.aplicado.backend.dto.user;

import lombok.Data;

@Data
public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private String cpf;
    private String city;
    private String gender;
    private String bloodType;
    private String role;
}
