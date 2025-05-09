package com.projeto.aplicado.backend.dto.bloodbank;

import lombok.Data;

@Data
public class BloodBankResponseDTO {
    private String id;
    private String name;
    private String email;
    private String registryNumber;
    private String region;
    private String role;
}
