package com.projeto.aplicado.backend.model.users;

import com.projeto.aplicado.backend.model.Campaign;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

import java.util.List;

@TypeAlias("BloodBank")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor
public class BloodBank extends UserBase {
    private String cnpj;
    private List<Campaign> campaigns;
}
