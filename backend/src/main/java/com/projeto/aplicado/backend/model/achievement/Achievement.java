package com.projeto.aplicado.backend.model.achievement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("achievements")
public class Achievement {
    private String id;
    private String title;
    private String description;
    private int points;
    private String rarity;
    private String imageUrl;
    private AchievementCondition condition; // Type and Value (e.g., "times_donated" and 10)
}
