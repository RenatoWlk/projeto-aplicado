package com.projeto.aplicado.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class OfferDTO {
    private String title;
    private String description;
    private LocalDate validUntil;
    private BigDecimal discountPercentage;
}
