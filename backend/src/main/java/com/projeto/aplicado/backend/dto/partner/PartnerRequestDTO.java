package com.projeto.aplicado.backend.dto.partner;

import lombok.Data;

@Data
public class PartnerRequestDTO {
    private String name;
    private String email;
    private String password;
    private String cnpj;
    private String companyName;
}
