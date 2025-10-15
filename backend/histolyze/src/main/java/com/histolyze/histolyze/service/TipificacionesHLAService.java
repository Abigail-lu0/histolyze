package com.histolyze.histolyze.service;

import com.histolyze.histolyze.model.TipificacionesHLA;
import java.util.List;
import java.util.Optional;

public interface TipificacionesHLAService {
    List<TipificacionesHLA> listarTipificaciones();
    Optional<TipificacionesHLA> obtenerPorId(Long id);
    TipificacionesHLA guardarTipificacion(TipificacionesHLA tipificacion);
    TipificacionesHLA actualizarTipificacion(TipificacionesHLA tipificacion);
    void eliminarTipificacion(Long id);
}
