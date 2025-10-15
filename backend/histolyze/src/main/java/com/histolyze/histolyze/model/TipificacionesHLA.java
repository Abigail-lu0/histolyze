package com.histolyze.histolyze.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "tipificaciones_hla")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipificacionesHLA {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_hla")
    private Long idHla;

    @Column(name = "nombre_muestra", nullable = false, length = 150)
    private String nombreMuestra;

    @Column(name = "locusA_01", length = 50)
    private String locusA01;

    @Column(name = "locusA_02", length = 50)
    private String locusA02;

    @Column(name = "locusB_01", length = 50)
    private String locusB01;

    @Column(name = "locusB_02", length = 50)
    private String locusB02;

    @Column(name = "locusC_01", length = 50)
    private String locusC01;

    @Column(name = "locusC_02", length = 50)
    private String locusC02;

    @Column(name = "locusDR_01", length = 50)
    private String locusDR01;

    @Column(name = "locusDR_02", length = 50)
    private String locusDR02;

    @Column(name = "locusDQA_01", length = 50)
    private String locusDQA01;

    @Column(name = "locusDQA_02", length = 50)
    private String locusDQA02;

    @Column(name = "locusDQ_01", length = 50)
    private String locusDQ01;

    @Column(name = "locusDQ_02", length = 50)
    private String locusDQ02;

    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;

    @Column(name = "grupo_sanguineo", length = 10)
    private String grupoSanguineo;

    @ManyToOne
    @JoinColumn(name = "id_paciente", nullable = false)
    private Paciente paciente;
}
