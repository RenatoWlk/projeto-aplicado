package com.projeto.aplicado.backend.dto;

import lombok.Data;

@Data
public class AchievementDTO {
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private Integer points;
    private String rarity;
    private String unlockedAt;
}