package com.projeto.aplicado.backend.model.users;

import com.projeto.aplicado.backend.model.achievement.UnlockedAchievement;
import com.projeto.aplicado.backend.model.enums.BloodType;
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
    private List<UnlockedAchievement> unlockedAchievements; // IDs and unlocked date of achievements
    private int totalPoints;
}
