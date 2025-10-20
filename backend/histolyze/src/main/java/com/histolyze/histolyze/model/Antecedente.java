package com.histolyze.histolyze.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "antecedente")
public class Antecedente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAntecedente;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT")
    private String medicacion;

    private LocalDate fechaComienzoHemodialisis;

    private Boolean embarazos;
    private Integer cantidadEmbarazos;

    private Boolean transfusiones;
    private LocalDate fechaTransfusiones;

    // Campo PD renombrado para claridad
    @Column(name = "proceso_donacion_transfusiones")
    private String procesoDonacion;

    private Boolean trasplantesPrevios;

    @Enumerated(EnumType.STRING)
    private GrupoSanguineo grupoSanguineo;

    // --- Embebemos la clase HlaDonante ---
    @Embedded
    private HlaDonante hlaDonante;

    // --- Relaciones ---
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // --- Enum para Grupo Sanguíneo ---
    public enum GrupoSanguineo {
        A_POSITIVO, A_NEGATIVO,
        B_POSITIVO, B_NEGATIVO,
        AB_POSITIVO, AB_NEGATIVO,
        O_POSITIVO, O_NEGATIVO
    }
}