package com.histolyze.histolyze.repository;

import com.histolyze.histolyze.model.TipificacionesHLA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipificacionesHLARepository extends JpaRepository<TipificacionesHLA, Long> {
}

