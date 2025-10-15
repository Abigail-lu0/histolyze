package com.histolyze.histolyze.controller;

import com.histolyze.histolyze.model.TipificacionesHLA;
import com.histolyze.histolyze.service.TipificacionesHLAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipificaciones_hla")
@CrossOrigin(origins = "http://localhost:4200")
public class TipificacionesHLAController {

    @Autowired
    private TipificacionesHLAService service;

    @GetMapping
    public ResponseEntity<List<TipificacionesHLA>> listarTipificaciones() {
        return ResponseEntity.ok(service.listarTipificaciones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipificacionesHLA> obtenerPorId(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipificacionesHLA> guardarTipificacion(@RequestBody TipificacionesHLA tipificacion) {
        return ResponseEntity.ok(service.guardarTipificacion(tipificacion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipificacionesHLA> actualizarTipificacion(@PathVariable Long id,
                                                                    @RequestBody TipificacionesHLA tipificacion) {
        tipificacion.setIdHla(id);
        return ResponseEntity.ok(service.actualizarTipificacion(tipificacion));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTipificacion(@PathVariable Long id) {
        service.eliminarTipificacion(id);
        return ResponseEntity.noContent().build();
    }
}
