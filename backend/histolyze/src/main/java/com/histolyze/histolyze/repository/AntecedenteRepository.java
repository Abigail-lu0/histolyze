package com.histolyze.histolyze.repository;

import com.histolyze.histolyze.model.Antecedente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AntecedenteRepository extends JpaRepository<Antecedente, Long> {
}
