package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.user.UserStatsDTO;
import com.projeto.aplicado.backend.dto.user.UserRequestDTO;
import com.projeto.aplicado.backend.dto.user.UserResponseDTO;
import com.projeto.aplicado.backend.model.users.User;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        user.setLastDonationDate(dto.getLastDonationDate());
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

    public void sendPasswordRecoveryEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String message = "Olá " + user.getName() + ",\n\n" +
                             "Seu login é: " + user.getEmail() + "\n\n" +
                             "Sua senha é: " + user.getPassword() + "\n\n";

            emailService.sendEmail(user.getEmail(), "Recuperação de Dados de Acesso", message);
        }
    }
}
