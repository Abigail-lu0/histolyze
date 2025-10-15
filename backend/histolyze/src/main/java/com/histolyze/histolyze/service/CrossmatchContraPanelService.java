package com.histolyze.histolyze.service;

import com.histolyze.histolyze.model.CrossmatchContraPanel;
import java.util.List;
import java.util.Optional;

public interface CrossmatchContraPanelService {
    CrossmatchContraPanel save(CrossmatchContraPanel crossmatch);
    List<CrossmatchContraPanel> findAll();
    Optional<CrossmatchContraPanel> findById(Long id);
    void delete(Long id);
    List<CrossmatchContraPanel> findByPaciente(Long idPaciente);
}
