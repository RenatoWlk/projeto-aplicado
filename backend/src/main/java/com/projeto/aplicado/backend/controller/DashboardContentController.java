package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.CampaignDTO;
import com.projeto.aplicado.backend.dto.OfferDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankNearbyDTO;
import com.projeto.aplicado.backend.service.BloodBankService;
import com.projeto.aplicado.backend.service.CampaignService;
import com.projeto.aplicado.backend.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardContentController {
    private final OfferService offerService;
    private final CampaignService campaignService;
    private final BloodBankService bloodBankService;

    @Autowired
    public DashboardContentController(OfferService offerService, CampaignService campaignService, BloodBankService bloodBankService) {
        this.offerService = offerService;
        this.campaignService = campaignService;
        this.bloodBankService = bloodBankService;
    }

    /**
     * Gets all offers for the dashboard.
     *
     * @return a list of offers
     */
    @GetMapping("/offers")
    public ResponseEntity<List<OfferDTO>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    /**
     * Gets all campaigns for the dashboard.
     *
     * @return a list of campaigns
     */
    @GetMapping("/campaigns")
    public ResponseEntity<List<CampaignDTO>> getAllCampaigns() {
        return ResponseEntity.ok(campaignService.getAllCampaigns());
    }

    /**
     * Creates a new campaign
     *
     * @return the new campaign created
     */
    @PostMapping("/campaign/create")
    public ResponseEntity<CampaignDTO> createCampaign(CampaignDTO campaignDTO, String bloodbankName) {
        return ResponseEntity.ok(campaignService.create(campaignDTO, bloodbankName));
    }

    /**
     * Creates a new offer
     *
     * @return the new offer created
     */
    @PostMapping("/offer/create")
    public ResponseEntity<OfferDTO> createOffer(OfferDTO offerDTO, String partnerName) {
        return ResponseEntity.ok(offerService.create(offerDTO, partnerName));
    }

    /**
     * Gets nearby blood banks from the user.
     *
     * @return a list of campaigns
     */
    @GetMapping("/{id}/nearbyBloodbanks")
    public ResponseEntity<List<BloodBankNearbyDTO>> getNearbyBloodbanks(@PathVariable String id) {
        return ResponseEntity.ok(bloodBankService.getNearbyBloodbanksFromUser(id));
    }
}
