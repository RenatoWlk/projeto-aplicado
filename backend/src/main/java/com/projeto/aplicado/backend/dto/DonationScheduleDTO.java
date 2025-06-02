package com.projeto.aplicado.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class DonationScheduleDTO {
    private String userId;
    private String bloodBankId;
    private LocalDate date;
    private LocalTime hour;
}
