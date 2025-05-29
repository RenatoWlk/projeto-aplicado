package com.projeto.aplicado.backend.model.users;

import com.projeto.aplicado.backend.model.Campaign;
import com.projeto.aplicado.backend.model.DonationsOverTime;
import com.projeto.aplicado.backend.model.enums.BloodType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@TypeAlias("BloodBank")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor
public class BloodBank extends UserBase {
    private String cnpj;
    private List<Campaign> campaigns = new ArrayList<>();
    private int totalDonations;
    private int scheduledDonations;
    private List<DonationsOverTime> donationsOverTime;
    private Map<BloodType, Integer> bloodTypeBloodBags;
}
