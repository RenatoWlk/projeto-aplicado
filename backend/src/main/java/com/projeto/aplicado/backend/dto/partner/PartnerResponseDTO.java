package com.projeto.aplicado.backend.dto.partner;

import lombok.Data;

@Data
public class PartnerResponseDTO {
    private String id;
    private String name;
    private String email;
    private String cnpj;
    private String companyName;
    private String role;
}
