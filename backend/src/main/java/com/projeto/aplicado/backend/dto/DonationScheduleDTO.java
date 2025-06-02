package com.projeto.aplicado.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DonationScheduleDTO {
    private String userId;
    private String bloodBankId;
    private LocalDateTime dateTime;
}

