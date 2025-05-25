package com.projeto.aplicado.backend.repository;

import com.projeto.aplicado.backend.model.users.Partner;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartnerRepository extends MongoRepository<Partner, String> {
    Optional<Partner> findByEmail(String email);
    boolean existsByCnpj(String cnpj);
}

