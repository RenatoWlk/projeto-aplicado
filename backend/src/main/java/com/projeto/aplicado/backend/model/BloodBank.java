package com.projeto.aplicado.backend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

@TypeAlias("BloodBank")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor
public class BloodBank extends UserBase {
    private String registryNumber;
    private String region;
}
