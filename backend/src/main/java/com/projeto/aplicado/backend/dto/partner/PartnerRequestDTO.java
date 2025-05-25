package com.projeto.aplicado.backend.dto.partner;

import com.projeto.aplicado.backend.model.Address;
import com.projeto.aplicado.backend.model.Offer;
import lombok.Data;

import java.util.List;

@Data
public class PartnerRequestDTO {
    private String name;
    private String email;
    private String password;
    private Address address;
    private String phone;
    private String cnpj;
    private List<Offer> offers;
}
