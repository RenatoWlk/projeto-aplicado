package com.projeto.aplicado.backend.service;

import com.projeto.aplicado.backend.dto.AchievementDTO;
import com.projeto.aplicado.backend.dto.ChangePasswordDTO;
import com.projeto.aplicado.backend.dto.QuestionnaireDTO;
import com.projeto.aplicado.backend.dto.user.*;
import com.projeto.aplicado.backend.model.users.User;
import com.projeto.aplicado.backend.model.enums.Role;
import com.projeto.aplicado.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.projeto.aplicado.backend.service.EmailService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    // Diretório para upload de fotos
    private static final String UPLOAD_DIR = "uploads/users/";

    public UserResponseDTO create(UserRequestDTO dto) {
        // Verificar se email já existe
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        // Verificar se CPF já existe
        if (userRepository.existsByCpf(dto.getCpf())) {
            throw new RuntimeException("CPF já cadastrado");
        }
        
        User user = new User();
        mapDtoToEntity(dto, user);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        
        User savedUser = userRepository.save(user);
        return mapEntityToDto(savedUser);
    }

    public UserResponseDTO findById(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return mapEntityToDto(user);
    }

    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public UserResponseDTO update(String id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar se email mudou e já existe
        if (!user.getEmail().equals(dto.getEmail()) && 
            userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        mapDtoToEntity(dto, user);
        // Não atualizar senha aqui
        
        User updatedUser = userRepository.save(user);
        return mapEntityToDto(updatedUser);
    }

    public void delete(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }

    public UserStatsDTO findStatsById(String id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        UserStatsDTO stats = new UserStatsDTO();
        stats.setBloodType(user.getBloodType());
        stats.setTotalDonations(user.getTotalDonations() != null ? user.getTotalDonations() : 0);
        stats.setLastDonationDate(user.getLastDonationDate());
        
        // Calcular próxima doação possível
        if (user.getLastDonationDate() != null) {
            LocalDate nextDonation = calculateNextDonationDate(
                user.getLastDonationDate(), 
                user.getGender()
            );
            stats.setNextDonationDate(nextDonation);
        }
        
        return stats;
    }

    public String uploadPhoto(String id, MultipartFile file) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Validar arquivo
        if (file.isEmpty()) {
            throw new RuntimeException("Arquivo vazio");
        }
        
        // Validar tipo
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("O arquivo deve ser uma imagem");
        }
        
        // Validar tamanho (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new RuntimeException("O arquivo deve ter no máximo 5MB");
        }
        
        try {
            // Criar diretório se não existir
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Gerar nome único para o arquivo
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null ? 
                originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
            String filename = UUID.randomUUID().toString() + extension;
            
            // Salvar arquivo
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, file.getBytes());
            
            // Deletar foto antiga se existir
            if (user.getPhotoUrl() != null && !user.getPhotoUrl().isEmpty()) {
                try {
                    Path oldPhoto = Paths.get(user.getPhotoUrl());
                    Files.deleteIfExists(oldPhoto);
                } catch (Exception e) {
                    // Log error but continue
                }
            }
            
            // Atualizar usuário
            String photoUrl = "/uploads/users/" + filename;
            user.setPhotoUrl(photoUrl);
            userRepository.save(user);
            
            return photoUrl;
            
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo", e);
        }
    }

    public void changePassword(String id, ChangePasswordDTO dto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Verificar senha atual
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Senha atual incorreta");
        }
        
        // Atualizar senha
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    public void sendPasswordRecoveryEmail(String email) {
        Optional<User> userOpt = userRepository.findUserByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String message = "Olá " + user.getName() + ",\n\n" +
                             "Seu login é: " + user.getEmail() + "\n\n" +
                             "Sua senha é: " + user.getPassword() + "\n\n";

            emailService.sendEmail(user.getEmail(), "Recuperação de Dados de Acesso", message);
        }
    }

    // Métodos auxiliares
    private void mapDtoToEntity(UserRequestDTO dto, User entity) {
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setAddress(dto.getAddress());
        entity.setPhone(dto.getPhone());
        entity.setCpf(dto.getCpf());
        entity.setGender(dto.getGender());
        entity.setBloodType(dto.getBloodType());
        entity.setTimeUntilNextDonation(dto.getTimeUntilNextDonation());
        entity.setLastDonationDate(dto.getLastDonationDate());
    }

    private UserResponseDTO mapEntityToDto(User entity) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setAddress(entity.getAddress());
        dto.setPhone(entity.getPhone());
        dto.setCpf(entity.getCpf());
        dto.setGender(entity.getGender());
        dto.setBloodType(entity.getBloodType());
        dto.setTimeUntilNextDonation(
            entity.getTimeUntilNextDonation() != null ? (int) entity.getTimeUntilNextDonation().toDays() : null
        );
        dto.setLastDonationDate(entity.getLastDonationDate());
        dto.setPhotoUrl(entity.getPhotoUrl());
        return dto;
    }

    private LocalDate calculateNextDonationDate(LocalDate lastDonation, String gender) {
        // Homens: 60 dias, Mulheres: 90 dias
        int days = "Masculino".equalsIgnoreCase(gender) ? 60 : 90;
        return lastDonation.plus(days, ChronoUnit.DAYS);
    }

    // Implementações dos métodos de achievements e questionnaires
    public List<AchievementDTO> getAchievements(String id) {
        // TODO: Implementar busca de conquistas
        return List.of();
    }

    public List<QuestionnaireDTO> getQuestionnaires(String id) {
        // TODO: Implementar busca de questionários
        return List.of();
    }

    public QuestionnaireDTO getLastQuestionnaire(String id) {
        // TODO: Implementar busca do último questionário
        return null;
    }
}