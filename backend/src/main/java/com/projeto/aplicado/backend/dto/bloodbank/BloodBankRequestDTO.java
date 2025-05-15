package com.projeto.aplicado.backend.dto.bloodbank;

import com.projeto.aplicado.backend.model.vo.Address;
import com.projeto.aplicado.backend.model.vo.Campaign;
import lombok.Data;

import java.util.List;

@Data
public class BloodBankRequestDTO {
    private String name;
    private String email;
    private String password;
    private Address address;
    private String phone;
    private String cnpj;
    private List<Campaign> campaigns;
}
