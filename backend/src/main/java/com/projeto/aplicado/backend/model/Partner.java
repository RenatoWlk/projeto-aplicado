package com.projeto.aplicado.backend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

@TypeAlias("Partner")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor
public class Partner extends UserBase {
    private String cnpj;
    private String companyName;
}
