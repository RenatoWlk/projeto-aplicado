package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.dto.EligibilityQuestionnaireDTO;
import com.projeto.aplicado.backend.model.EligibilityQuestionnaire;
import com.projeto.aplicado.backend.repository.EligibilityQuestionnaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EligibilityQuestionnaireService {

    @Autowired
    private EligibilityQuestionnaireRepository repository;

    public EligibilityQuestionnaire saveQuestionnaire(String userId, EligibilityQuestionnaireDTO dto) {
        EligibilityQuestionnaire questionnaire = new EligibilityQuestionnaire();

        questionnaire.setUserId(userId);
        questionnaire.setSexo(dto.getSexo());
        questionnaire.setIdade(dto.getIdade());
        questionnaire.setDoacaoAntesDos60(dto.getDoacaoAntesDos60());
        questionnaire.setPeso(dto.getPeso());
        questionnaire.setSaudavel(dto.getSaudavel());
        questionnaire.setGravida(dto.getGravida());
        questionnaire.setPartoRecente(dto.getPartoRecente());
        questionnaire.setSintomas(dto.getSintomas());
        questionnaire.setDoencas(dto.getDoencas());
        questionnaire.setMedicamentos(dto.getMedicamentos());
        questionnaire.setProcedimentos(dto.getProcedimentos());
        questionnaire.setDrogas(dto.getDrogas());
        questionnaire.setParceiros(dto.getParceiros());
        questionnaire.setTatuagem(dto.getTatuagem());
        questionnaire.setHomemUltimaDoacao(dto.getHomemUltimaDoacao());
        questionnaire.setMulherUltimaDoacao(dto.getMulherUltimaDoacao());
        questionnaire.setVacinaCovid(dto.getVacinaCovid());
        questionnaire.setVacinaFebre(dto.getVacinaFebre());
        questionnaire.setViagemRisco(dto.getViagemRisco());
        questionnaire.setEligible(dto.isEligible());
        questionnaire.setResultMessage(dto.getResultMessage());

        return repository.save(questionnaire);
    }

    public List<EligibilityQuestionnaire> getAllByUser(String userId) {
        return repository.findByUserId(userId);
    }
}
