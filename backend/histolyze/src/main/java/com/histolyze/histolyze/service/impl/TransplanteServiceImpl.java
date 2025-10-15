package com.histolyze.histolyze.service.impl;

import com.histolyze.histolyze.model.Transplante;
import com.histolyze.histolyze.repository.TransplanteRepository;
import com.histolyze.histolyze.service.TransplanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransplanteServiceImpl implements TransplanteService {

    @Autowired
    private TransplanteRepository transplanteRepository;

    @Override
    public List<Transplante> listarTodos() {
        return transplanteRepository.findAll();
    }

    @Override
    public Optional<Transplante> buscarPorId(Long id) {
        return transplanteRepository.findById(id);
    }

    @Override
    public Transplante guardar(Transplante transplante) {
        return transplanteRepository.save(transplante);
    }

    @Override
    public void eliminar(Long id) {
        transplanteRepository.deleteById(id);
    }
}
