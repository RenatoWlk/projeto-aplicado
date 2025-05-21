package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.constants.Messages;
import com.projeto.aplicado.backend.dto.user.UserRequestDTO;
import com.projeto.aplicado.backend.dto.user.UserResponseDTO;
import com.projeto.aplicado.backend.model.User;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponseDTO create(UserRequestDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        user.setRole(Role.USER);
        user.setCpf(dto.getCpf());
        user.setGender(dto.getGender());
        user.setBloodType(dto.getBloodType());
        user.setTimesDonated(0);
        user.setTimeUntilNextDonation(dto.getTimeUntilNextDonation());
        user.setLastDonationDate(dto.getLastDonationDate());
        user.setAchievements(null);
        user.setTotalPoints(0);

        user = userRepository.save(user);
        return toResponseDTO(user);
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public UserResponseDTO findById(String id) {
        return userRepository.findById(id)
                .map(this::toResponseDTO)
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
        dto.setTimesDonated(user.getTimesDonated());
        dto.setTimeUntilNextDonation(user.getTimeUntilNextDonation());
        dto.setLastDonationDate(user.getLastDonationDate());
        dto.setAchievements(user.getAchievements());
        dto.setTotalPoints(user.getTotalPoints());
        return dto;
    }
}
