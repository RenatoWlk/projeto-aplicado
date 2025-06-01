package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.OfferDTO;
import com.projeto.aplicado.backend.dto.partner.PartnerRequestDTO;
import com.projeto.aplicado.backend.dto.partner.PartnerResponseDTO;
import com.projeto.aplicado.backend.model.users.Partner;
import com.projeto.aplicado.backend.model.Offer;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartnerService {
    private final PartnerRepository partnerRepository;

    /**
     * Creates a new partner.
     * 
     * @param dto the partner request DTO containing the partner's details
     * @return the created partner response DTO
     */
    public PartnerResponseDTO create(PartnerRequestDTO dto) {
        Partner partner = new Partner();
        partner.setName(dto.getName());
        partner.setEmail(dto.getEmail());
        partner.setPassword(dto.getPassword());
        partner.setAddress(dto.getAddress());
        partner.setPhone(dto.getPhone());
        partner.setRole(Role.PARTNER);
        partner.setCnpj(dto.getCnpj());
        partner.setOffers(dto.getOffers());

        partner = partnerRepository.save(partner);
        return toResponseDTO(partner);
    }

    /**
     * Finds all partners.
     * 
     * @return a list of partner response DTOs
     */
    public List<PartnerResponseDTO> findAll() {
        return partnerRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Finds a partner by ID.
     * 
     * @param id the ID of the partner to find
     * @return the partner response DTO
     */
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
        dto.setAddress(partner.getAddress());
        dto.setPhone(partner.getPhone());
        dto.setRole(partner.getRole());
        dto.setCnpj(partner.getCnpj());
        dto.setOffers(partner.getOffers());
        return dto;
    }

    public String uploadPhoto(String id, MultipartFile file) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parceiro não encontrado"));

        try {
            String uploadDir = "uploads/partners/" + id;
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            String photoUrl = "/uploads/partners/" + id + "/" + filename;
            partner.setPhotoUrl(photoUrl);
            partnerRepository.save(partner);

            return photoUrl;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload da foto", e);
        }
    }

    public PartnerResponseDTO updatePartner(String id, PartnerRequestDTO dto) {
    Partner partner = partnerRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Parceiro não encontrado"));

    // Atualize os dados do partner a partir do DTO
    partner.setName(dto.getName());
    partner.setEmail(dto.getEmail());
    // etc...

    Partner updated = partnerRepository.save(partner);
    
    return toResponseDTO(updated);
}


    public List<Offer> getOffers(String id) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parceiro não encontrado"));
        return partner.getOffers();
    }

    public Offer createOffer(String id, OfferDTO dto) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parceiro não encontrado"));

        Offer offer = new Offer();
        offer.setTitle(dto.getTitle());
        offer.setDescription(dto.getDescription());
        offer.setDiscount(dto.getDiscount());
        offer.setExpirationDate(dto.getExpirationDate());
        // Adicione outros campos conforme necessário

        partner.getOffers().add(offer);
        partnerRepository.save(partner);
        return offer;
    }

    public Offer updateOffer(String id, String offerId, OfferDTO dto) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parceiro não encontrado"));

        Offer offer = partner.getOffers().stream()
                .filter(o -> o.getId().equals(offerId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Oferta não encontrada"));

        offer.setTitle(dto.getTitle());
        offer.setDescription(dto.getDescription());
        offer.setDiscount(dto.getDiscount());
        offer.setExpirationDate(dto.getExpirationDate());
        // Adicione outros campos conforme necessário

        partnerRepository.save(partner);
        return offer;
    }

    public void deleteOffer(String id, String offerId) {
        Partner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parceiro não encontrado"));

        boolean removed = partner.getOffers().removeIf(o -> o.getId().equals(offerId));
        if (!removed) {
            throw new RuntimeException("Oferta não encontrada");
        }
        partnerRepository.save(partner);
    }
}
