package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankRequestDTO;
import com.projeto.aplicado.backend.dto.bloodbank.BloodBankResponseDTO;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.model.users.BloodBank;
import com.projeto.aplicado.backend.repository.BloodBankRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service // Indica que essa classe é um serviço do Spring
@RequiredArgsConstructor // Gera o construtor com os atributos finais (injeção de dependência)
public class BloodBankService {

    private final BloodBankRepository bloodBankRepository; // Acesso ao banco de dados
    private final GeolocationService geolocationService; // Serviço de geolocalização
    private final PasswordEncoder passwordEncoder;

    /**
     * Cria um novo banco de sangue a partir do DTO de requisição.
     */
    public BloodBankResponseDTO create(BloodBankRequestDTO dto) {
        BloodBank bloodBank = new BloodBank();
        bloodBank.setName(dto.getName());
        bloodBank.setEmail(dto.getEmail());
        bloodBank.setPassword(passwordEncoder.encode(dto.getPassword()));
        bloodBank.setAddress(dto.getAddress());
        bloodBank.setPhone(dto.getPhone());
        bloodBank.setRole(Role.BLOODBANK);
        bloodBank.setCnpj(dto.getCnpj());
        bloodBank.setCampaigns(dto.getCampaigns());

        // Salva no banco de dados
        bloodBank = bloodBankRepository.save(bloodBank);

        // Retorna o DTO de resposta
        return toResponseDTO(bloodBank);
    }

    /**
     * Busca todos os bancos de sangue cadastrados.
     */
    public List<BloodBankResponseDTO> findAll() {
        return bloodBankRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca um banco de sangue pelo ID.
     */
    public BloodBankResponseDTO findById(String id) {
        return bloodBankRepository.findById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    /**
     * Busca todos os bancos de sangue e retorna com latitude e longitude.
     */
    public List<BloodBankResponseDTO> getAllWithLocation() {
        return bloodBankRepository.findAll().stream().map(bloodBank -> {
            BloodBankResponseDTO dto = toResponseDTO(bloodBank);

            // Verifica se o endereço está completo
            if (bloodBank.getAddress() == null ||
                bloodBank.getAddress().getStreet() == null ||
                bloodBank.getAddress().getCity() == null ||
                bloodBank.getAddress().getState() == null ||
                bloodBank.getAddress().getZipCode() == null) {
                return dto; // Sem localização se tiver dados faltando
            }

            try {
                // Monta o endereço completo em texto
                String fullAddress = String.format("%s, %s, %s, %s",
                        bloodBank.getAddress().getStreet(),
                        bloodBank.getAddress().getCity(),
                        bloodBank.getAddress().getState(),
                        bloodBank.getAddress().getZipCode());

                // Faz a chamada para obter latitude e longitude
                double[] coordinates = geolocationService.getCoordinatesFromAddress(fullAddress);

                // Atribui as coordenadas ao DTO
                dto.setLatitude(coordinates[0]);
                dto.setLongitude(coordinates[1]);
            } catch (Exception e) {
                // Em caso de erro, seta coordenadas como 0
                e.printStackTrace();
                dto.setLatitude(0.0);
                dto.setLongitude(0.0);
            }

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Converte uma entidade BloodBank para um DTO de resposta.
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
}
