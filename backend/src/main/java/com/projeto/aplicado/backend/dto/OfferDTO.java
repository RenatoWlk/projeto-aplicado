package com.projeto.aplicado.backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter @Setter
@Data
public class OfferDTO {
    private String partnerName;
    private String title;
    private String body;
    private LocalDate validUntil;
    private BigDecimal discountPercentage;
    private String description;
    private int discount;
    private LocalDate expirationDate;
}
