package com.histolyze.histolyze.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "paciente")
@Data           // Genera getters, setters, toString, equals y hashCode automáticamente
@NoArgsConstructor
@AllArgsConstructor
@Builder        // Permite usar el patrón builder para crear objetos
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // AUTO_INCREMENT en MySQL
    private Integer idPaciente;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, unique = true, length = 20)
    private String dni;

    private LocalDate fechaNacimiento;

    @Column(length = 255)
    private String domicilio;

    @Column(length = 20)
    private String telefono;

    @Column(length = 50)
    private String numeroMuestra;

    @Column(length = 150)
    private String centroDialisis;

    @Column(length = 150)
    private String centroTx;

    @Column(length = 100)
    private String mutual;

    @Column(length = 100)
    private String medicoSolicitante;

    @ManyToOne
    @JoinColumn(name = "creado_por", nullable = false)
    private Usuario creadoPor;      // referencia a la entidad Usuario

    @ManyToOne
    @JoinColumn(name = "completado_por")
    private Usuario completadoPor;  // referencia a la entidad Usuario

    @OneToMany(mappedBy = "paciente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // Ayuda a evitar bucles infinitos al convertir a JSON
    private List<Antecedente> antecedentes;
}