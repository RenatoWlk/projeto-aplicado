package com.projeto.aplicado.backend.repository;

import com.projeto.aplicado.backend.model.users.BloodBank;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodBankRepository extends MongoRepository<BloodBank, String> {
    Optional<BloodBank> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("{ 'role': 'BLOODBANK' }")
    List<BloodBank> findAllBloodBanks();
}
