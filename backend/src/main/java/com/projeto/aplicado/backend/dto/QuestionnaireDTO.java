package com.projeto.aplicado.backend.dto;

public class QuestionnaireDTO {
    private String id;
    private String userId;
    private String questionnaireType; // "DONOR" or "PARTNER"
    private String answers; // JSON string of answers
    private String createdAt;

    public QuestionnaireDTO() {
    }

    public QuestionnaireDTO(String id, String userId, String questionnaireType, String answers, String createdAt) {
        this.id = id;
        this.userId = userId;
        this.questionnaireType = questionnaireType;
        this.answers = answers;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getQuestionnaireType() {
        return questionnaireType;
    }

    public void setQuestionnaireType(String questionnaireType) {
        this.questionnaireType = questionnaireType;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }   
    
}
