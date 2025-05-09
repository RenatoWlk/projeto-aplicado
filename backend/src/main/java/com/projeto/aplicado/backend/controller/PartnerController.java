package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.partner.PartnerRequestDTO;
import com.projeto.aplicado.backend.dto.partner.PartnerResponseDTO;
import com.projeto.aplicado.backend.service.PartnerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partners")
@RequiredArgsConstructor
public class PartnerController {
    private final PartnerService partnerService;

    @PostMapping
    public ResponseEntity<PartnerResponseDTO> create(@RequestBody PartnerRequestDTO dto) {
        return ResponseEntity.ok(partnerService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<PartnerResponseDTO>> getAll() {
        return ResponseEntity.ok(partnerService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartnerResponseDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(partnerService.findById(id));
    }
}
