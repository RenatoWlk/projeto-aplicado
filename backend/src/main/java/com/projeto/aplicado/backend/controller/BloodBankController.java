package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.bloodbank.BloodBankRequestDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankResponseDTO;
import com.projeto.aplicado.backend.service.BloodBankService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
     * Retrieves all blood banks with geolocation (latitude and longitude)
     * to be displayed on the map.
     *
     * @return a list of blood banks with location data
     */
    @GetMapping("/locations")
    public ResponseEntity<List<BloodBankResponseDTO>> getBloodBanksWithLocation() {
        return ResponseEntity.ok(bloodBankService.getAllWithLocation());
    }
}
