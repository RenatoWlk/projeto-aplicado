package com.projeto.aplicado.backend.repository;

import com.projeto.aplicado.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}
