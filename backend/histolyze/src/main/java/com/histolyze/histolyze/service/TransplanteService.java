package com.histolyze.histolyze.service;

import com.histolyze.histolyze.model.Transplante;
import java.util.List;
import java.util.Optional;

public interface TransplanteService {

    List<Transplante> listarTodos();
    Optional<Transplante> buscarPorId(Long id);
    Transplante guardar(Transplante transplante);
    void eliminar(Long id);
}
