package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.CampaignDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankNearbyDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankRequestDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankResponseDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankStatsDTO;
import com.projeto.aplicado.backend.dto.user.UserStatsDTO;
import com.projeto.aplicado.backend.model.Campaign;
import com.projeto.aplicado.backend.model.enums.BloodType;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.model.users.BloodBank;
import com.projeto.aplicado.backend.model.users.User;
import com.projeto.aplicado.backend.repository.BloodBankRepository;
import com.projeto.aplicado.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BloodBankService {
    private final BloodBankRepository bloodBankRepository;
    private final UserRepository userRepository;
    private final GeolocationService geolocationService;

    /**
     * Creates a new blood bank based on the provided request data. <br>
     * Initializes default values for campaigns, total donations, blood bags, and donation history.
     *
     * @param dto the data transfer object containing blood bank creation data
     * @return the created blood bank as a response DTO
     */
    public BloodBankResponseDTO create(BloodBankRequestDTO dto) {
        BloodBank bloodBank = new BloodBank();
        bloodBank.setName(dto.getName());
        bloodBank.setEmail(dto.getEmail());
        bloodBank.setPassword(dto.getPassword());
        bloodBank.setAddress(dto.getAddress());
        bloodBank.setPhone(dto.getPhone());
        bloodBank.setRole(Role.BLOODBANK);
        bloodBank.setCnpj(dto.getCnpj());
        bloodBank.setCampaigns(new ArrayList<>());
        bloodBank.setTotalDonations(0);
        bloodBank.setScheduledDonations(0);

        // Initialize all blood types with zero blood bags
        Map<BloodType, Integer> initialBags = new EnumMap<>(BloodType.class);
        Arrays.stream(BloodType.values()).forEach(type -> initialBags.put(type, 0));
        bloodBank.setBloodTypeBloodBags(initialBags);

        // Start with an empty donation history
        bloodBank.setDonationsOverTime(new ArrayList<>());

        bloodBank = bloodBankRepository.save(bloodBank);
        return toResponseDTO(bloodBank);
    }

    /**
     * Retrieves all blood banks from the database.
     *
     * @return a list of blood bank response DTOs
     */
    public List<BloodBankResponseDTO> findAll() {
        return bloodBankRepository.findAllBloodBanks().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Finds a blood bank by its ID.
     *
     * @param id the ID of the blood bank
     * @return the blood bank as a response DTO
     * @throws RuntimeException if no blood bank is found with the given ID
     */
    public BloodBankResponseDTO findById(String id) {
        return bloodBankRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    /**
     * Retrieves statistical data for a specific blood bank.
     *
     * @param id the ID of the blood bank
     * @return a DTO containing blood donation statistics
     */
    public BloodBankStatsDTO findStatsById(String id) {
        return bloodBankRepository.findById(id)
                .map(this::toStatsDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    /**
     * Retrieves all the campaigns for a specific blood bank.
     *
     * @param id the ID of the blood bank
     * @return a list containing all the campaigns from the blood bank
     */
    public List<CampaignDTO> findCampaignsById(String id) {
        return bloodBankRepository.findById(id)
                .map(this::toCampaignsDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    /**
     * Retrieves all blood banks and attempts to enrich each one with geolocation data. <br>
     * If the address is incomplete or an error occurs, coordinates are set to 0.
     *
     * @return a list of blood bank DTOs including location information
     */
    public List<BloodBankResponseDTO> getAllWithLocation() {
        return bloodBankRepository.findAllBloodBanks().stream().map(bloodBank -> {
            BloodBankResponseDTO dto = toResponseDTO(bloodBank);

            if (bloodBank.getAddress() == null ||
                    bloodBank.getAddress().getStreet() == null ||
                    bloodBank.getAddress().getCity() == null ||
                    bloodBank.getAddress().getState() == null ||
                    bloodBank.getAddress().getZipCode() == null) {
                return dto;
            }

            try {
                String fullAddress = String.format("%s, %s, %s, %s",
                        bloodBank.getAddress().getStreet(),
                        bloodBank.getAddress().getCity(),
                        bloodBank.getAddress().getState(),
                        bloodBank.getAddress().getZipCode());

                double[] coordinates = geolocationService.getCoordinatesFromAddress(fullAddress);
                dto.setLatitude(coordinates[0]);
                dto.setLongitude(coordinates[1]);
            } catch (Exception e) {
                System.err.println("Error trying to get the coords");
                System.err.println("Error message: " + e.getMessage());
                dto.setLatitude(0.0);
                dto.setLongitude(0.0);
            }

            return dto;
        }).collect(Collectors.toList());
    }

    public List<BloodBankNearbyDTO> getNearbyBloodbanksFromUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));

        if (user.getAddress() == null ||
                user.getAddress().getStreet() == null ||
                user.getAddress().getCity() == null ||
                user.getAddress().getState() == null ||
                user.getAddress().getZipCode() == null) {
            throw new RuntimeException(Messages.USER_ADDRESS_INCOMPLETE);
        }

        String userAddress = removeAccents(user.getAddress().getStreet().toLowerCase());
        double[] userCoordinates = geolocationService.getCoordinatesFromAddress(userAddress);
        double userLat = userCoordinates[0];
        double userLon = userCoordinates[1];

        System.out.println("\n\nLat: " + userLat + " - Lon: " + userLon);

        final double MAX_DISTANCE_KM = 80.0;

        return bloodBankRepository.findAllBloodBanks().stream().map(bloodBank -> {
            BloodBankNearbyDTO dto = toNearbyDTO(bloodBank, 0.0);

            try {
                if (bloodBank.getAddress() != null) {
                    String fullAddress = removeAccents(bloodBank.getAddress().getStreet().toLowerCase());

                    double[] coordinates = geolocationService.getCoordinatesFromAddress(fullAddress);

                    if (coordinates[0] != 0.0) {
                        double bankLat = coordinates[0];
                        double bankLon = coordinates[1];

                        double distance = calculateDistance(userLat, userLon, bankLat, bankLon);

                        if (distance <= MAX_DISTANCE_KM) {
                            dto.setDistance(distance);
                            System.out.println("Distance: " + distance);
                            return dto;
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("\n\n\n\nError trying to get the coords");
                System.err.println("Error message: " + e.getMessage());
            }

            return null;
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS_KM = 6371;

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    public String removeAccents(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    /**
     * Converts a BloodBank entity to its corresponding response DTO.
     *
     * @param bloodBank the blood bank entity
     * @return the response DTO
     */
    private BloodBankResponseDTO toResponseDTO(BloodBank bloodBank) {
        BloodBankResponseDTO dto = new BloodBankResponseDTO();
        dto.setId(bloodBank.getId());
        dto.setName(bloodBank.getName());
        dto.setEmail(bloodBank.getEmail());
        dto.setAddress(bloodBank.getAddress());
        dto.setPhone(bloodBank.getPhone());
        dto.setRole(bloodBank.getRole());
        dto.setCnpj(bloodBank.getCnpj());
        dto.setCampaigns(bloodBank.getCampaigns());
        return dto;
    }

    /**
     * Converts a BloodBank entity to a DTO containing statistical data.
     *
     * @param bloodBank the blood bank entity
     * @return the statistics DTO
     */
    private BloodBankStatsDTO toStatsDTO(BloodBank bloodBank) {
        BloodBankStatsDTO dto = new BloodBankStatsDTO();
        dto.setTotalDonations(bloodBank.getTotalDonations());
        dto.setDonationsOverTime(bloodBank.getDonationsOverTime());
        dto.setBloodTypeBloodBags(bloodBank.getBloodTypeBloodBags());
        dto.setScheduledDonations(bloodBank.getScheduledDonations());
        return dto;
    }

    /**
     * Converts a BloodBank entity to a DTO containing all the campaigns.
     *
     * @param bloodBank the blood bank entity
     * @return the list of campaigns DTOs
     */
    private List<CampaignDTO> toCampaignsDTO(BloodBank bloodBank) {
        List<CampaignDTO> dtoList = new ArrayList<>();

        for (Campaign campaign : bloodBank.getCampaigns()) {
            CampaignDTO dto = new CampaignDTO();
            dto.setTitle(campaign.getTitle());
            dto.setBody(campaign.getBody());
            dto.setStartDate(campaign.getStartDate());
            dto.setEndDate(campaign.getEndDate());
            dto.setPhone(campaign.getPhone());
            dto.setLocation(campaign.getLocation());
            dtoList.add(dto);
        }

        return dtoList;
    }

    private BloodBankNearbyDTO toNearbyDTO(BloodBank bloodBank, Double distance) {
        BloodBankNearbyDTO dto = new BloodBankNearbyDTO();
        dto.setName(bloodBank.getName());
        dto.setAddress(bloodBank.getAddress());
        dto.setPhone(bloodBank.getPhone());
        dto.setDistance(distance);
        return dto;
    }
}
