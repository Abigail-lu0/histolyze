package com.histolyze.histolyze.controller;

import com.histolyze.histolyze.model.Transplante;
import com.histolyze.histolyze.service.TransplanteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transplantes")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class TransplanteController {

    @Autowired
    private TransplanteService transplanteService;

    @GetMapping
    public List<Transplante> listar() {
        return transplanteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transplante> buscarPorId(@PathVariable Long id) {
        return transplanteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Transplante guardar(@RequestBody Transplante transplante) {
        return transplanteService.guardar(transplante);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        transplanteService.eliminar(id);
    }
}
