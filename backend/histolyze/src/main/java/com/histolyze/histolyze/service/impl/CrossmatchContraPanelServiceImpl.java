package com.histolyze.histolyze.service.impl;

import com.histolyze.histolyze.model.CrossmatchContraPanel;
import com.histolyze.histolyze.repository.CrossmatchContraPanelRepository;
import com.histolyze.histolyze.service.CrossmatchContraPanelService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CrossmatchContraPanelServiceImpl implements CrossmatchContraPanelService {

    private final CrossmatchContraPanelRepository repository;

    public CrossmatchContraPanelServiceImpl(CrossmatchContraPanelRepository repository) {
        this.repository = repository;
    }

    @Override
    public CrossmatchContraPanel save(CrossmatchContraPanel crossmatch) {
        return repository.save(crossmatch);
    }

    @Override
    public List<CrossmatchContraPanel> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<CrossmatchContraPanel> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<CrossmatchContraPanel> findByPaciente(Long idPaciente) {
        return repository.findByPacienteIdPaciente(idPaciente);
    }
}
