package com.projeto.aplicado.backend.dto;

import lombok.Getter;
import lombok.Setter;
@Getter @Setter
public class EligibilityQuestionnaireDTO {
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
