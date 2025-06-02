package com.projeto.aplicado.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor
public class DonationAppointment {

    @Id
    private String id;
    private String userId;
    private String bloodBankId;
    private LocalDateTime dateTime;

}
