package com.projeto.aplicado.backend.model.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Achievement {
    private String title;
    private String description;
    private int points;
    private String rarity;
    private String imageUrl;
}
