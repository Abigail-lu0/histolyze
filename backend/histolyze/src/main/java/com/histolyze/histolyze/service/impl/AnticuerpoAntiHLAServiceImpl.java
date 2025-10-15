package com.histolyze.histolyze.service.impl;

import com.histolyze.histolyze.model.AnticuerpoAntiHLA;
import com.histolyze.histolyze.repository.AnticuerpoAntiHLARepository;
import com.histolyze.histolyze.service.AnticuerpoAntiHLAService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AnticuerpoAntiHLAServiceImpl implements AnticuerpoAntiHLAService {

    private final AnticuerpoAntiHLARepository repository;

    public AnticuerpoAntiHLAServiceImpl(AnticuerpoAntiHLARepository repository) {
        this.repository = repository;
    }

    @Override
    public AnticuerpoAntiHLA save(AnticuerpoAntiHLA anticuerpo) {
        return repository.save(anticuerpo);
    }

    @Override
    public List<AnticuerpoAntiHLA> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<AnticuerpoAntiHLA> findById(Long id) {
        return repository.findById(id);
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<AnticuerpoAntiHLA> findByDsa(Long idDsa) {
        return repository.findByDsaIdDsa(idDsa);
    }
}
