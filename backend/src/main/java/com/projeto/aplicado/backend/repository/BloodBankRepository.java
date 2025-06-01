package com.projeto.aplicado.backend.repository;

import com.projeto.aplicado.backend.model.users.BloodBank;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BloodBankRepository extends MongoRepository<BloodBank, String> {
    @Query("{ '_id': ?0, 'role': 'BLOODBANK' }")
    Optional<BloodBank> findBloodBankById(String id);

    @Query("{ 'email': ?0, 'role': 'BLOODBANK' }")
    Optional<BloodBank> findByEmail(String email);

    @Query("{ 'role': 'BLOODBANK' }")
    List<BloodBank> findAllBloodBanks();
}
