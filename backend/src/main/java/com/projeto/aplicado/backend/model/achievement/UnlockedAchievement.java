package com.projeto.aplicado.backend.model.achievement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
public class UnlockedAchievement {
    private String achievementId;
    private LocalDateTime unlockedAt;
}

