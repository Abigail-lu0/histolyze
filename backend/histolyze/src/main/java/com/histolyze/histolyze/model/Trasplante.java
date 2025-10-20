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
@Table(name = "trasplante")
public class Trasplante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plante")
    private Long idTrasplante;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hla_donante")
    private String hlaDonante;

    // (un trasplante pertenece a un antecedente)
    @ManyToOne
    @JoinColumn(name = "id_antecedente", nullable = false)
    private Antecedente antecedente;

    // Enum para tipo de trasplante
    public enum Tipo {
        CRIOPRECIPITADOS, PLAQUETOFERESIS, PLASMAFERESIS, SEDIMENTO_GLOBULAR
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tipo tipo;
}
