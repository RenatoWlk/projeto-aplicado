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

    @PostMapping
    public ResponseEntity<BloodBankResponseDTO> create(@RequestBody BloodBankRequestDTO dto) {
        return ResponseEntity.ok(bloodBankService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<BloodBankResponseDTO>> getAll() {
        return ResponseEntity.ok(bloodBankService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BloodBankResponseDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(bloodBankService.findById(id));
    }
}
