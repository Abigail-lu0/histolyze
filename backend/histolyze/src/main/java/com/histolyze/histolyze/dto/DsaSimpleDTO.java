package com.histolyze.histolyze.dto;

import com.histolyze.histolyze.model.DSA;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DsaSimpleDTO {
    private Long idDsa;
    private String numeroMuestra;
    private LocalDate fecha;
    private String nombrePaciente;
    private String medicoSolicitante;
    private String dniPaciente;
    private Long idPaciente;

    // Un constructor para mapear fácil desde la Entidad
    public DsaSimpleDTO(DSA dsa) {
        this.idDsa = dsa.getIdDsa();
        this.numeroMuestra = dsa.getNumeroMuestra();
        this.fecha = dsa.getFecha();
        this.nombrePaciente = dsa.getNombrePaciente();
        this.medicoSolicitante = dsa.getMedicoSolicitante();
        this.dniPaciente = dsa.getDniPaciente();
        this.idPaciente = dsa.getPaciente().getIdPaciente();
    }
}