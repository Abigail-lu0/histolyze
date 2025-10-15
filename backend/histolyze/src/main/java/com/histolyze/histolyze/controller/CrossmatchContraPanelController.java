package com.histolyze.histolyze.controller;

import com.histolyze.histolyze.model.CrossmatchContraPanel;
import com.histolyze.histolyze.service.CrossmatchContraPanelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crossmatch")
@CrossOrigin(origins = "*")
public class CrossmatchContraPanelController {

    private final CrossmatchContraPanelService service;

    public CrossmatchContraPanelController(CrossmatchContraPanelService service) {
        this.service = service;
    }

    @GetMapping
    public List<CrossmatchContraPanel> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public CrossmatchContraPanel getById(@PathVariable Long id) {
        return service.findById(id).orElse(null);
    }

    @GetMapping("/paciente/{idPaciente}")
    public List<CrossmatchContraPanel> getByPaciente(@PathVariable Long idPaciente) {
        return service.findByPaciente(idPaciente);
    }

    @PostMapping
    public CrossmatchContraPanel create(@RequestBody CrossmatchContraPanel crossmatch) {
        return service.save(crossmatch);
    }

    @PutMapping("/{id}")
    public CrossmatchContraPanel update(@PathVariable Long id, @RequestBody CrossmatchContraPanel crossmatch) {
        crossmatch.setIdCrossmatch(id);
        return service.save(crossmatch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
