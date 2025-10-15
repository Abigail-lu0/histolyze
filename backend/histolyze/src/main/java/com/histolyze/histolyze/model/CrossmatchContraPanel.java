package com.histolyze.histolyze.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "crossmatch_contra_panel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CrossmatchContraPanel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_crossmatch")
    private Long idCrossmatch;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "anti_hla_1", length = 255)
    private String antiHla1;

    @Column(name = "anti_hla_2", length = 255)
    private String antiHla2;

    @Column(name = "anti_mica", length = 255)
    private String antiMica;

    @Column(name = "anticuerpos_especificos", length = 255)
    private String anticuerposEspecificos;

    // Relación con Paciente
    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;
}
