package com.projeto.aplicado.backend.model.users;

import com.projeto.aplicado.backend.model.achievement.UnlockedAchievement;
import com.projeto.aplicado.backend.model.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "users")
@TypeAlias("User")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class User extends UserBase {
    private String cpf;
    private String gender;
    private BloodType bloodType;
    private int timesDonated;
    private int timeUntilNextDonation;
    private LocalDate lastDonationDate;
    private List<UnlockedAchievement> unlockedAchievements; // IDs and unlocked date of achievements
    private int totalPoints;
}
