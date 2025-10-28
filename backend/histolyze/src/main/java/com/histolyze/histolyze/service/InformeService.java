package com.histolyze.histolyze.service;

import com.histolyze.histolyze.dto.DsaSimpleDTO;
import com.histolyze.histolyze.dto.HlaSimpleDTO;
import com.histolyze.histolyze.dto.InformeDsaResponseDTO;
import com.histolyze.histolyze.dto.InformeHlaResponseDTO;
import com.histolyze.histolyze.model.*;
import com.histolyze.histolyze.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InformeService {

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private DSARepository dsaRepository;

    @Autowired
    private AnticuerpoAntiHLARepository anticuerpoRepository;

    @Autowired
    private TipificacionesHLARepository tipificacionesHLARepository;

    @Autowired
    private AntecedenteRepository antecedenteRepository;

    public InformeDsaResponseDTO getDatosInformeDsa(String dni) {

        // 1. Buscar al paciente por DNI
        Paciente paciente = pacienteRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con DNI: " + dni));

        // 2. Encontrar el ÚLTIMO estudio DSA de ese paciente
        // Usamos el método del repo que ordena por fecha
        DSA ultimoDsa = dsaRepository.findByPacienteOrderByFechaDesc(paciente)
                .stream()
                .findFirst() // Obtenemos el primero de la lista (el más reciente)
                .orElseThrow(() -> new RuntimeException("No se encontraron estudios DSA para el paciente: " + dni));

        // 3. Traer todos los anticuerpos para ESE estudio
        List<AnticuerpoAntiHLA> anticuerpos = anticuerpoRepository.findByDsa(ultimoDsa);

        // 4. Armar el DTO de respuesta que espera el frontend
        DsaSimpleDTO dsaDto = new DsaSimpleDTO(ultimoDsa);

        return new InformeDsaResponseDTO(dsaDto, anticuerpos);
    }

    public void guardarObservacionDsa(Long idDsa, String observaciones) {
        // 1. Buscar el estudio DSA por su ID
        DSA dsa = dsaRepository.findById(idDsa)
                .orElseThrow(() -> new RuntimeException("Estudio DSA no encontrado con ID: " + idDsa));

        // 2. Settear las observaciones
        dsa.setObservaciones(observaciones);

        // 3. Guardar la entidad actualizada en la BD
        dsaRepository.save(dsa);
    }

    public InformeHlaResponseDTO getDatosInformeHla(String dni) {
        // 1. Buscar Paciente
        Paciente paciente = pacienteRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con DNI: " + dni));

        // 2. Buscar su HLA más reciente
        Optional<TipificacionesHLA> hlaOpt = tipificacionesHLARepository.findByPacienteOrderByFechaRegistroDesc(paciente)
                .stream().findFirst();

        // 3. Buscar su Antecedente más reciente (para el grupo sanguíneo)
        Optional<Antecedente> antOpt = antecedenteRepository.findByPacienteOrderByIdAntecedenteDesc(paciente)
                .stream().findFirst();

        // 4. Construir el DTO
        InformeHlaResponseDTO responseDto = new InformeHlaResponseDTO();
        responseDto.setNombre(paciente.getNombre() + " " + paciente.getApellido());
        responseDto.setDni(paciente.getDni());

        if (hlaOpt.isPresent()) {
            TipificacionesHLA hla = hlaOpt.get();
            responseDto.setMuestra(hla.getNumeroMuestra());
            responseDto.setHla(new HlaSimpleDTO(hla)); // Mapea los locus

            responseDto.setIdHla(hla.getIdHla());
        }

        if (antOpt.isPresent()) {
            Antecedente ant = antOpt.get();
            if (ant.getGrupoSanguineo() != null) {
                responseDto.setGrupoSanguineo(ant.getGrupoSanguineo().name()); // Convierte el Enum a String
            }
        }

        return responseDto;
    }

    public void guardarObservacionHla(Long idHla, String observaciones) {
        // 1. Buscar el registro de Tipificacion HLA por su ID
        TipificacionesHLA hla = tipificacionesHLARepository.findById(idHla)
                .orElseThrow(() -> new RuntimeException("Registro HLA no encontrado con ID: " + idHla));

        // 2. Settear las observaciones
        hla.setObservaciones(observaciones);

        // 3. Guardar la entidad actualizada en la BD
        tipificacionesHLARepository.save(hla);
    }
}