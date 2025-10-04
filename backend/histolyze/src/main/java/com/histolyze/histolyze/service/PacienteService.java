package com.histolyze.histolyze.service;

import com.histolyze.histolyze.model.Paciente;

import java.util.List;
import java.util.Optional;

public interface PacienteService {

    Paciente guardarPaciente(Paciente paciente);

    Optional<Paciente> obtenerPacientePorId(Integer id);

    Optional<Paciente> obtenerPacientePorDni(String dni);

    List<Paciente> listarPacientes();

    void eliminarPaciente(Integer id);
}
