package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.dto.CampaignDTO;
import com.projeto.aplicado.backend.repository.BloodBankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampaignService {
    private final BloodBankRepository bloodBankRepository;

    @Autowired
    public CampaignService(BloodBankRepository bloodBankRepository) {
        this.bloodBankRepository = bloodBankRepository;
    }

    /**
     * Fetches all campaigns from the database and converts them to DTOs.
     * 
     * @return a list of CampaignDTO objects representing all campaigns.
     */
    public List<CampaignDTO> getAllCampaigns() {
        return bloodBankRepository.findAll().stream()
                .flatMap(b -> b.getCampaigns().stream())
                .map(c -> {
                    CampaignDTO dto = new CampaignDTO();
                    dto.setTitle(c.getTitle());
                    dto.setBody(c.getBody());
                    dto.setStartDate(c.getStartDate());
                    dto.setEndDate(c.getEndDate());
                    dto.setLocation(c.getLocation());
                    dto.setPhone(c.getPhone());
                    return dto;
                }).toList();
    }
}

