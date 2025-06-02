package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.ChangePasswordDTO;
import com.projeto.aplicado.backend.dto.user.UserLocationDTO;
import com.projeto.aplicado.backend.dto.user.UserStatsDTO;
import com.projeto.aplicado.backend.dto.user.UserRequestDTO;
import com.projeto.aplicado.backend.dto.user.UserResponseDTO;
import com.projeto.aplicado.backend.model.users.User;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; 
    private final AchievementService achievementService;
    private final EmailService emailService;
    private final GeolocationService geolocationService;

    // Diretório para upload de fotos
    private static final String UPLOAD_DIR = "uploads/users/";

    /**
     * Creates a new user in the system.
     * 
     * @param dto the user request DTO containing user details
     * @return the created user response DTO
     */
    public UserResponseDTO create(UserRequestDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setRole(Role.USER);
        user.setCpf(dto.getCpf());
        user.setGender(dto.getGender());
        user.setBloodType(dto.getBloodType());
        user.setTimesDonated(0);
        user.setTimeUntilNextDonation(0);
        user.setLastDonationDate(null);
        user.setUnlockedAchievements(List.of());
        user.setTotalPoints(0);

        user = userRepository.save(user);
        return toResponseDTO(user);
    }

    /**
     * Finds all users in the system.
     * 
     * @return a list of user response DTOs
     */
    public List<UserResponseDTO> findAll() {
        return userRepository.findAllUsers().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Finds a user by ID.
     * 
     * @param id the ID of the user to find
     * @return the user response DTO
     */
    public UserResponseDTO findById(String id) {
        return userRepository.findUserById(id)
                .map(this::toResponseDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    /**
     * Finds user statistics by ID.
     * 
     * @param id the ID of the user to find statistics for
     * @return the user statistics DTO
     */
    public UserStatsDTO findStatsById(String id) {
        return userRepository.findUserById(id)
                .map(this::toStatsDTO)
                .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    /**
     * Retrieves all blood banks and attempts to enrich each one with geolocation data. <br>
     * If the address is incomplete or an error occurs, coordinates are set to 0.
     *
     * @return a list of blood bank DTOs including location information
     */
    public UserLocationDTO findLocationById(String id) {
        return userRepository.findById(id)
            .map(user -> {
                UserLocationDTO dto = toLocationDTO(user);

                if (user.getAddress() == null ||
                        user.getAddress().getStreet() == null ||
                        user.getAddress().getCity() == null ||
                        user.getAddress().getState() == null ||
                        user.getAddress().getZipCode() == null) {
                    return dto;
                }

                try {
                    String address = removeAccents(user.getAddress().getStreet().toLowerCase());
                    double[] coordinates = geolocationService.getCoordinatesFromAddress(address);
                    dto.setLatitude(coordinates[0]);
                    dto.setLongitude(coordinates[1]);
                } catch (Exception e) {
                    System.err.println("Error trying to get the coords: " + e.getMessage());
                    dto.setLatitude(0.0);
                    dto.setLongitude(0.0);
                }

                return dto;
            })
            .orElseThrow(() -> new RuntimeException(Messages.USER_NOT_FOUND));
    }

    private UserResponseDTO toResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setCpf(user.getCpf());
        dto.setGender(user.getGender());
        dto.setBloodType(user.getBloodType());
        return dto;
    }

    private UserStatsDTO toStatsDTO(User user) {
        UserStatsDTO dto = new UserStatsDTO();
        dto.setTimesDonated(user.getTimesDonated());
        dto.setTimeUntilNextDonation(user.getTimeUntilNextDonation());
        dto.setLastDonationDate(user.getLastDonationDate());
        dto.setAchievements(achievementService.getAchievementsFromUser(user));
        dto.setTotalPoints(user.getTotalPoints());
        dto.setBloodType(user.getBloodType());
        return dto;
    }

    private UserLocationDTO toLocationDTO(User user) {
        UserLocationDTO dto = new UserLocationDTO();
        dto.setName(user.getName());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        return dto;
    }

    public void sendPasswordRecoveryEmail(String email) {
        Optional<User> userOpt = userRepository.findUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String message = "Olá " + user.getName() + ",\n\n" +
                             "Seu login é: " + user.getEmail() + "\n\n" +
                             "Sua senha é: " + user.getPassword() + "\n\n";

            emailService.sendEmail(user.getEmail(), "Recuperação de Dados de Acesso", message);
        }
    }

    public String removeAccents(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    /*
     * Account
     */

     public UserResponseDTO update(String id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se email mudou e já existe
        if (!user.getEmail().equals(dto.getEmail()) && 
            userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        toResponseDTO(user);
        
        User updatedUser = userRepository.save(user);
        return toResponseDTO(updatedUser);
    }

    public void delete(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }

    public void changePassword(String id, ChangePasswordDTO dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar senha atual
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        // Atualizar senha
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

}
