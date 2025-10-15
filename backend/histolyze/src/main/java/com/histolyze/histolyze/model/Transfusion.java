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
@Table(name = "transfusion")
public class Transfusion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transfusion")
    private Long idTransfusion;

    @Column(nullable = false)
    private LocalDate fecha;

    // (una transfusion pertenece a un antecedente)
    @ManyToOne
    @JoinColumn(name = "id_antecedente", nullable = false)
    private Antecedente antecedente;
}