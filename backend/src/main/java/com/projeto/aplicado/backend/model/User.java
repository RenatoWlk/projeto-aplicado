package com.projeto.aplicado.backend.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.TypeAlias;

@TypeAlias("User")
@EqualsAndHashCode(callSuper = true)
@Data @NoArgsConstructor
public class User extends UserBase {
    private String cpf;
    private String city;
    private String gender;
    private String bloodType;
}
