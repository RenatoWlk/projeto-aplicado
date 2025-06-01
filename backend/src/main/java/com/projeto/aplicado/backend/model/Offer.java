package com.projeto.aplicado.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data @NoArgsConstructor @AllArgsConstructor
public class Offer {
    private String title;
    private String body;
    private LocalDate validUntil;
    private BigDecimal discountPercentage;
    public Object getId() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getId'");
    }
    private String description;
    private int discount;
    private LocalDate expirationDate;
}
