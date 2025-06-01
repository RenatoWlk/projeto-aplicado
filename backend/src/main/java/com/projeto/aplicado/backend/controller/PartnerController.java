package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.OfferDTO;
import com.projeto.aplicado.backend.dto.partner.PartnerRequestDTO;
import com.projeto.aplicado.backend.dto.partner.PartnerResponseDTO;
import com.projeto.aplicado.backend.model.Offer;
import com.projeto.aplicado.backend.service.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {
    private final PartnerService partnerService;

    /**
     * Creates a new partner.
     * 
     * @param dto the partner request DTO
     * @return the created partner response DTO
     */
    @PostMapping
    public ResponseEntity<PartnerResponseDTO> create(@RequestBody PartnerRequestDTO dto) {
        return ResponseEntity.ok(partnerService.create(dto));
    }

    /**
     * Gets all partners.
     * 
     * @return a list of partner response DTOs
     */
    @GetMapping
    public ResponseEntity<List<PartnerResponseDTO>> getAll() {
        return ResponseEntity.ok(partnerService.findAll());
    }

    /**
     * Get an existing partner.
     * 
     * @param id the ID of the partner to get
     * @return the partner response DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<PartnerResponseDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(partnerService.findById(id));
    }

    /**
     * Update partner.
     */
    @PutMapping("/{id}")
    public ResponseEntity<PartnerResponseDTO> updatePartner(
            @PathVariable String id,
            @RequestBody PartnerRequestDTO dto) {
        return ResponseEntity.ok(partnerService.updatePartner(id, dto));
    }

    /**
     * Upload partner photo.
     */
    @PostMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        String photoUrl = partnerService.uploadPhoto(id, file);
        return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
    }

    /**
     * Get all offers for a partner.
     */
    @GetMapping("/{id}/offers")
    public ResponseEntity<List<Offer>> getOffers(@PathVariable String id) {
        return ResponseEntity.ok(partnerService.getOffers(id));
    }

    /**
     * Create a new offer.
     */
    @PostMapping("/{id}/offers")
    public ResponseEntity<Offer> createOffer(
            @PathVariable String id,
            @RequestBody OfferDTO dto) {
        return ResponseEntity.ok(partnerService.createOffer(id, dto));
    }

    /**
     * Update offer.
     */
    @PutMapping("/{id}/offers/{offerId}")
    public ResponseEntity<Offer> updateOffer(
            @PathVariable String id,
            @PathVariable String offerId,
            @RequestBody OfferDTO dto) {
        return ResponseEntity.ok(partnerService.updateOffer(id, offerId, dto));
    }

    /**
     * Delete offer.
     */
    @DeleteMapping("/{id}/offers/{offerId}")
    public ResponseEntity<Void> deleteOffer(
            @PathVariable String id,
            @PathVariable String offerId) {
        partnerService.deleteOffer(id, offerId);
        return ResponseEntity.noContent().build();
    }
    
}
