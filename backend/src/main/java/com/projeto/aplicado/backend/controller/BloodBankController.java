package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.CampaignDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankRequestDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankResponseDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankStatsDTO;
import com.projeto.aplicado.backend.model.Campaign;
import com.projeto.aplicado.backend.service.BloodBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bloodbanks")
@RequiredArgsConstructor
public class BloodBankController {
    private final BloodBankService bloodBankService;

    /**
     * Creates a new blood bank.
     *
     * @param dto the blood bank request DTO
     * @return the created blood bank response DTO
     */
    @PostMapping
    public ResponseEntity<BloodBankResponseDTO> create(@RequestBody BloodBankRequestDTO dto) {
        return ResponseEntity.ok(bloodBankService.create(dto));
    }

    /**
     * Gets all blood banks.
     *
     * @return a list of blood bank response DTOs
     */
    @GetMapping
    public ResponseEntity<List<BloodBankResponseDTO>> getAll() {
        return ResponseEntity.ok(bloodBankService.findAll());
    }

    /**
     * Get an existing blood bank by ID.
     *
     * @param id the ID of the blood bank to retrieve
     * @return the blood bank response DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<BloodBankResponseDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(bloodBankService.findById(id));
    }

    /**
     * Upload blood bank photo.
     */
    @PostMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        String photoUrl = bloodBankService.uploadPhoto(id, file);
        return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
    }



    /**
     * Retrieves all blood banks with geolocation (latitude and longitude)
     * to be displayed on the map.
     *
     * @return a list of blood banks with location data
     */
    @GetMapping("/locations")
    public ResponseEntity<List<BloodBankResponseDTO>> getBloodBanksWithLocation() {
        return ResponseEntity.ok(bloodBankService.getAllWithLocation());
    }

    /**
     * Get the stats of a blood bank by ID.
     *
     * @param id the ID of the blood bank to retrieve the stats
     * @return the blood bank stats DTO
     */
    @GetMapping("/{id}/stats")
    public ResponseEntity<BloodBankStatsDTO> getStatsById(@PathVariable String id) {
        return ResponseEntity.ok(bloodBankService.findStatsById(id));
    }

    /**
     * Get the campaigns of a blood bank by ID.
     *
     * @param id the ID of the blood bank to retrieve the campaigns
     * @return the blood bank campaigns DTO
     */
    @GetMapping("/{id}/campaigns")
    public ResponseEntity<List<CampaignDTO>> getCampaignsById(@PathVariable String id) {
        return ResponseEntity.ok(bloodBankService.findCampaignsById(id));
    }

    /**
     * Create a new campaign.
     */
    @PostMapping("/{id}/campaigns")
    public ResponseEntity<CampaignDTO> createCampaign(
            @PathVariable String id,
            @RequestBody CampaignDTO dto) {
        return ResponseEntity.ok(bloodBankService.createCampaign(id, dto));
    }

    /**
     * Update campaign.
     */
    @PutMapping("/{id}/campaigns/{campaignId}")
    public ResponseEntity<CampaignDTO> updateCampaign(
            @PathVariable String id,
            @PathVariable String campaignId,
            @RequestBody CampaignDTO dto) {
        return ResponseEntity.ok(bloodBankService.updateCampaign(id, campaignId, dto));
    }

    /**
     * Delete campaign.
     */
    @DeleteMapping("/{id}/campaigns/{campaignId}")
    public ResponseEntity<Void> deleteCampaign(
            @PathVariable String id,
            @PathVariable String campaignId) {
        bloodBankService.deleteCampaign(id, campaignId);
        return ResponseEntity.noContent().build();
    }
}
