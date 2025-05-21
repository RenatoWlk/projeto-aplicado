package com.projeto.aplicado.backend.dto.user;

import com.projeto.aplicado.backend.model.enums.BloodType;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.model.vo.Achievement;
import com.projeto.aplicado.backend.model.vo.Address;
import lombok.Data;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@Data
public class UserResponseDTO {
    private String id;
    private String name;
    private String email;
    private Address address;
    private String phone;
    private Role role;
    private String cpf;
    private String gender;
    private BloodType bloodType;
    private int timesDonated;
    private Duration timeUntilNextDonation;
    private LocalDate lastDonationDate;
    private List<Achievement> achievements;
    private int totalPoints;
}
