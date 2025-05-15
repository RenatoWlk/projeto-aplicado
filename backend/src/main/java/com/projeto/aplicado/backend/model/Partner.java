package com.projeto.aplicado.backend.model;

import com.projeto.aplicado.backend.model.vo.Offer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

import java.util.List;

@TypeAlias("Partner")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class Partner extends UserBase {
    private String cnpj;
    private List<Offer> offers;
}
