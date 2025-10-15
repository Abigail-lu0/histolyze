package com.histolyze.histolyze.service.impl;


import com.histolyze.histolyze.model.TipificacionesHLA;
import com.histolyze.histolyze.repository.TipificacionesHLARepository;
import com.histolyze.histolyze.service.TipificacionesHLAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipificacionesHLAServiceImpl implements TipificacionesHLAService {

    @Autowired
    private TipificacionesHLARepository repository;

    @Override
    public List<TipificacionesHLA> listarTipificaciones() {
        return repository.findAll();
    }

    @Override
    public Optional<TipificacionesHLA> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    @Override
    public TipificacionesHLA guardarTipificacion(TipificacionesHLA tipificacion) {
        return repository.save(tipificacion);
    }

    @Override
    public TipificacionesHLA actualizarTipificacion(TipificacionesHLA tipificacion) {
        return repository.save(tipificacion);
    }

    @Override
    public void eliminarTipificacion(Long id) {
        repository.deleteById(id);
    }
}

