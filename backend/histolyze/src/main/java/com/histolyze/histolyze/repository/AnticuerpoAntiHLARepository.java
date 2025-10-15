package com.histolyze.histolyze.repository;

import com.histolyze.histolyze.model.AnticuerpoAntiHLA;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnticuerpoAntiHLARepository extends JpaRepository<AnticuerpoAntiHLA, Long> {
    List<AnticuerpoAntiHLA> findByDsaIdDsa(Long idDsa);
}
