package com.projeto.aplicado.backend.model.users;

import com.projeto.aplicado.backend.model.Offer;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

import java.util.ArrayList;
import java.util.List;

@TypeAlias("Partner")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class Partner extends UserBase {
    private String cnpj;
    private List<Offer> offers = new ArrayList<>();
}
