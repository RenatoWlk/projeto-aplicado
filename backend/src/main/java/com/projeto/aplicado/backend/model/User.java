package com.projeto.aplicado.backend.model;

import com.projeto.aplicado.backend.model.enums.BloodType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

@TypeAlias("User")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor @AllArgsConstructor
public class User extends UserBase {
    private String cpf;
    private String gender;
    private BloodType bloodType;
}
