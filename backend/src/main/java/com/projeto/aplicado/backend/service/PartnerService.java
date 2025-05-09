package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.constants.Roles;
import com.projeto.aplicado.backend.dto.partner.PartnerRequestDTO;
import com.projeto.aplicado.backend.dto.partner.PartnerResponseDTO;
import com.projeto.aplicado.backend.model.Partner;
import com.projeto.aplicado.backend.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartnerService {
    private final PartnerRepository partnerRepository;

    public PartnerResponseDTO create(PartnerRequestDTO dto) {
        Partner partner = new Partner();
        partner.setName(dto.getName());
        partner.setEmail(dto.getEmail());
        partner.setPassword(dto.getPassword());
        partner.setCnpj(dto.getCnpj());
        partner.setCompanyName(dto.getCompanyName());
        partner.setRole(Roles.PARTNER);

        partner = partnerRepository.save(partner);
        return toResponseDTO(partner);
    }

    public List<PartnerResponseDTO> findAll() {
        return partnerRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public PartnerResponseDTO findById(String id) {
        return partnerRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    private PartnerResponseDTO toResponseDTO(Partner partner) {
        PartnerResponseDTO dto = new PartnerResponseDTO();
        dto.setId(partner.getId());
        dto.setName(partner.getName());
        dto.setEmail(partner.getEmail());
        dto.setCnpj(partner.getCnpj());
        dto.setCompanyName(partner.getCompanyName());
        return dto;
    }
}
