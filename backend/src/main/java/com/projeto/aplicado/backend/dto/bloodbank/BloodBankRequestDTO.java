package com.projeto.aplicado.backend.dto.bloodbank;

import lombok.Data;

@Data
public class BloodBankRequestDTO {
    private String name;
    private String email;
    private String password;
    private String registryNumber;
    private String region;
}
