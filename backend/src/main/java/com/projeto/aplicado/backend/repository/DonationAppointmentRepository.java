package com.projeto.aplicado.backend.repository;

import com.projeto.aplicado.backend.model.DonationAppointment;
import com.projeto.aplicado.backend.model.users.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
public interface DonationAppointmentRepository extends MongoRepository<DonationAppointment, String> {
}
