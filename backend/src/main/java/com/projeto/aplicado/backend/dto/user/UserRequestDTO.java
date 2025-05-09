package com.projeto.aplicado.backend.dto.user;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String name;
    private String email;
    private String password;
    private String cpf;
    private String city;
    private String gender;
    private String bloodType;
}
