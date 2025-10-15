package com.histolyze.histolyze.repository;

import com.histolyze.histolyze.model.Transplante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransplanteRepository extends JpaRepository<Transplante, Long> {
}
