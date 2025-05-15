package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankRequestDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankResponseDTO;
import com.projeto.aplicado.backend.model.BloodBank;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.repository.BloodBankRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodBankService {
    private final BloodBankRepository bloodBankRepository;

    public BloodBankResponseDTO create(BloodBankRequestDTO dto) {
        BloodBank bloodBank = new BloodBank();
        bloodBank.setName(dto.getName());
        bloodBank.setEmail(dto.getEmail());
        bloodBank.setPassword(dto.getPassword());
        bloodBank.setAddress(dto.getAddress());
        bloodBank.setPhone(dto.getPhone());
        bloodBank.setRole(Role.BLOODBANK);
        bloodBank.setCnpj(dto.getCnpj());
        bloodBank.setCampaigns(dto.getCampaigns());
        bloodBank = bloodBankRepository.save(bloodBank);
        return toResponseDTO(bloodBank);
    }

    public List<BloodBankResponseDTO> findAll() {
        return bloodBankRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public BloodBankResponseDTO findById(String id) {
        return bloodBankRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    private BloodBankResponseDTO toResponseDTO(BloodBank bloodBank) {
        BloodBankResponseDTO dto = new BloodBankResponseDTO();
        dto.setId(bloodBank.getId());
        dto.setName(bloodBank.getName());
        dto.setEmail(bloodBank.getEmail());
        dto.setAddress(bloodBank.getAddress());
        dto.setPhone(bloodBank.getPhone());
        dto.setRole(bloodBank.getRole());
        dto.setCnpj(bloodBank.getCnpj());
        dto.setCampaigns(bloodBank.getCampaigns());
        return dto;
    }
}
