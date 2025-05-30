package com.projeto.aplicado.backend.repository;

import com.projeto.aplicado.backend.model.users.Partner;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerRepository extends MongoRepository<Partner, String> {
    Optional<Partner> findByEmail(String email);
    boolean existsByCnpj(String cnpj);

    @Query("{ 'role': 'PARTNER' }")
    List<Partner> findAllPartners();
}

