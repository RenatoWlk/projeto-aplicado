package com.projeto.aplicado.backend.controller;

import com.projeto.aplicado.backend.dto.AchievementDTO;
import com.projeto.aplicado.backend.dto.ChangePasswordDTO;
import com.projeto.aplicado.backend.dto.QuestionnaireDTO;
import com.projeto.aplicado.backend.dto.user.UserRequestDTO;
import com.projeto.aplicado.backend.dto.user.UserResponseDTO;
import com.projeto.aplicado.backend.dto.user.UserStatsDTO;
import com.projeto.aplicado.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * Creates a new user.
     * 
     * @param dto the user request DTO
     * @return the created user response DTO
     */
    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.create(dto));
    }

    /**
     * Gets all users.
     * 
     * @return a list of user response DTOs
     */
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    /**
     * Get an existing user.
     * 
     * @param id the ID of the user to get
     * @return the user response DTO
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    /**
     * Update an existing user.
     * 
     * @param id the ID of the user to update
     * @param dto the user update data
     * @return the updated user response DTO
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable String id,
            @RequestBody UserRequestDTO dto) {
        return ResponseEntity.ok(userService.update(id, dto));
    }

    /**
     * Delete a user.
     * 
     * @param id the ID of the user to delete
     * @return no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get the statistics of a user.
     * 
     * @param id the ID of the user to get statistics for
     * @return the user statistics DTO
     */
    @GetMapping("/{id}/stats")
    public ResponseEntity<UserStatsDTO> getStatsById(@PathVariable String id) {
        return ResponseEntity.ok(userService.findStatsById(id));
    }

    /**
     * Change user password.
     * 
     * @param id the ID of the user
     * @param dto the password change data
     * @return no content
     */
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable String id,
            @RequestBody ChangePasswordDTO dto) {
        userService.changePassword(id, dto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        userService.sendPasswordRecoveryEmail(email);
        return ResponseEntity.ok().build();
    }

    /**
     * Upload user profile photo.
     * 
     * @param id the ID of the user
     * @param file the photo file
     * @return the photo URL
     */
    @PostMapping(value = "/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadPhoto(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        String photoUrl = userService.uploadPhoto(id, file);
        return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
    }

    /**
     * Get user achievements.
     * 
     * @param id the ID of the user
     * @return list of achievements
     */
    @GetMapping("/{id}/achievements")
    public ResponseEntity<List<AchievementDTO>> getAchievements(@PathVariable String id) {
        return ResponseEntity.ok(userService.getAchievements(id));
    }


        /**
     * Get user questionnaires.
     * 
     * @param id the ID of the user
     * @return list of questionnaires
     */
    @GetMapping("/{id}/questionnaires")
    public ResponseEntity<List<QuestionnaireDTO>> getQuestionnaires(@PathVariable String id) {
        return ResponseEntity.ok(userService.getQuestionnaires(id));
    }

    /**
     * Get last questionnaire.
     * 
     * @param id the ID of the user
     * @return the last questionnaire or null
     */
    @GetMapping("/{id}/questionnaires/last")
    public ResponseEntity<QuestionnaireDTO> getLastQuestionnaire(@PathVariable String id) {
        QuestionnaireDTO lastQuestionnaire = userService.getLastQuestionnaire(id);
        return lastQuestionnaire != null 
            ? ResponseEntity.ok(lastQuestionnaire) 
            : ResponseEntity.noContent().build();
    }
}

