package com.projeto.aplicado.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter @Setter
@Document(collection = "questionnaire")
public class EligibilityQuestionnaire {
    @Id
    private String id;

    private String userId;

    private String sexo;
    private String idade;
    private String doacaoAntesDos60;
    private String peso;
    private String saudavel;
    private String gravida;
    private String partoRecente;
    private String sintomas;
    private String doencas;
    private String medicamentos;
    private String procedimentos;
    private String drogas;
    private String parceiros;
    private String tatuagem;
    private String homemUltimaDoacao;
    private String mulherUltimaDoacao;
    private String vacinaCovid;
    private String vacinaFebre;
    private String viagemRisco;
    private boolean isEligible;
    private String resultMessage;
}