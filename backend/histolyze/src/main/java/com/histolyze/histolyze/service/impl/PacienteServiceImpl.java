package com.histolyze.histolyze.service.impl;

import com.histolyze.histolyze.model.Paciente;
import com.histolyze.histolyze.model.Usuario;
import com.histolyze.histolyze.repository.UsuarioRepository;
import com.histolyze.histolyze.repository.PacienteRepository;
import com.histolyze.histolyze.service.PacienteService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;
    private final UsuarioRepository usuarioRepository;

    @Autowired
    public PacienteServiceImpl(PacienteRepository pacienteRepository, UsuarioRepository usuarioRepository) {
        this.pacienteRepository = pacienteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public Paciente guardarPaciente(Paciente paciente) {
        // --- AUDITORÍA ---
        String usuarioDni = SecurityContextHolder.getContext().getAuthentication().getName();

        Usuario usuarioActual = usuarioRepository.findByDni(usuarioDni)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado en el contexto de seguridad"));

        paciente.setCreadoPor(usuarioActual);

        // --- ASIGNACIÓN DE RELACIONES EN CASCADA ---
        if (paciente.getAntecedentes() != null) {
            paciente.getAntecedentes().forEach(antecedente -> {
                antecedente.setPaciente(paciente);
                antecedente.setUsuario(usuarioActual);

                // --- BLOQUE CORREGIDO ---
                // Usamos los nuevos nombres de las listas definidos en Antecedente.java
                if (antecedente.getListaTransfusiones() != null) { // <-- NOMBRE CORREGIDO
                    antecedente.getListaTransfusiones().forEach(transfusion -> { // <-- NOMBRE CORREGIDO
                        transfusion.setAntecedente(antecedente);
                    });
                }
                if (antecedente.getListaTrasplantes() != null) { // <-- NOMBRE CORREGIDO
                    antecedente.getListaTrasplantes().forEach(trasplante -> { // <-- NOMBRE CORREGIDO
                        trasplante.setAntecedente(antecedente);
                    });
                }
                // --- FIN BLOQUE CORREGIDO ---
            });
        }

        return pacienteRepository.save(paciente);
    }

    @Override
    public Optional<Paciente> obtenerPacientePorId(Integer id) {
        return pacienteRepository.findById(id);
    }

    @Override
    public Optional<Paciente> obtenerPacientePorDni(String dni) {
        return pacienteRepository.findByDni(dni);
    }

    @Override
    public List<Paciente> listarPacientes() {
        return pacienteRepository.findAll();
    }

    @Override
    public void eliminarPaciente(Integer id) {
        pacienteRepository.deleteById(id);
    }
}