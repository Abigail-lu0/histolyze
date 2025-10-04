package com.histolyze.histolyze.repository;

import com.histolyze.histolyze.model.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, Integer> {

    // Ejemplo: buscar un paciente por DNI
    Optional<Paciente> findByDni(String dni);
}
