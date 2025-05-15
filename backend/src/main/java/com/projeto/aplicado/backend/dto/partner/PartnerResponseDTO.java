package com.projeto.aplicado.backend.dto.partner;

import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.model.vo.Address;
import com.projeto.aplicado.backend.model.vo.Offer;
import lombok.Data;

import java.util.List;

@Data
public class PartnerResponseDTO {
    private String id;
    private String name;
    private String email;
    private Address address;
    private String phone;
    private Role role;
    private String cnpj;
    private List<Offer> offers;
}
