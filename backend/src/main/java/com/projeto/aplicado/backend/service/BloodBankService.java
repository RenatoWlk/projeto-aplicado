package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.constants.Roles;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankRequestDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankResponseDTO;
import com.projeto.aplicado.backend.model.BloodBank;
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
        bloodBank.setRegistryNumber(dto.getRegistryNumber());
        bloodBank.setRegion(dto.getRegion());
        bloodBank.setRole(Roles.BLOOD_BANK);

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
        dto.setRegion(bloodBank.getRegion());
        dto.setRegistryNumber(bloodBank.getRegistryNumber());
        return dto;
    }
}
