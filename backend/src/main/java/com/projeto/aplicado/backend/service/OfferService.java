package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.dto.OfferDTO;
import com.projeto.aplicado.backend.model.Offer;
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

    /**
     * Fetches all offers from all partners.
     * 
     * @return a list of OfferDTO objects containing offer details.
     */
    public List<OfferDTO> getAllOffers() {
        return partnerRepository.findAll().stream()
                .flatMap(partner -> partner.getOffers().stream()
                        .map(offer -> toDTO(partner.getName(), offer)))
                .toList();
    }

    private OfferDTO toDTO(String partnerName, Offer offer) {
        OfferDTO dto = new OfferDTO();
        dto.setPartnerName(partnerName);
        dto.setTitle(offer.getTitle());
        dto.setBody(offer.getBody());
        dto.setValidUntil(offer.getValidUntil());
        dto.setDiscountPercentage(offer.getDiscountPercentage());
        return dto;
    }
}

