package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.dto.OfferDTO;
import com.projeto.aplicado.backend.repository.PartnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferService {
    private final PartnerRepository partnerRepository;

    @Autowired
    public OfferService(PartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    public List<OfferDTO> getAllOffers() {
        return partnerRepository.findAll().stream()
                .flatMap(p -> p.getOffers().stream())
                .map(o -> {
                    OfferDTO dto = new OfferDTO();
                    dto.setTitle(o.getTitle());
                    dto.setDescription(o.getDescription());
                    dto.setValidUntil(o.getValidUntil());
                    dto.setDiscountPercentage(o.getDiscountPercentage());
                    return dto;
                }).toList();
    }
}

