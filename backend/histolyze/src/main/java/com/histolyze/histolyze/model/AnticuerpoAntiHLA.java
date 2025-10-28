package com.histolyze.histolyze.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "anticuerpo_anti_hla")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnticuerpoAntiHLA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_anticuerpo")
    private Long idAnticuerpo;

    @Column(nullable = false, length = 100)
    private String serologico;

    @Column(nullable = false, length = 100)
    private String alelico;

    private Integer mfi;

    @Column(length = 50)
    private String resultado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoClase tipo; // Clase1 o Clase2

    // Relación con DSA
    @ManyToOne
    @JoinColumn(name = "id_dsa", nullable = false)
    @JsonIgnore
    private DSA dsa;

    public enum TipoClase {
        Clase1,
        Clase2
    }
}
