package com.projeto.aplicado.backend.model;

import com.projeto.aplicado.backend.model.enums.BloodType;
import com.projeto.aplicado.backend.model.vo.Achievement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;

@TypeAlias("User")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class User extends UserBase {
    private String cpf;
    private String gender;
    private BloodType bloodType;
    private int timesDonated;
    private Duration timeUntilNextDonation;
    private LocalDate lastDonationDate;
    private List<Achievement> achievements;
    private int totalPoints;
}
