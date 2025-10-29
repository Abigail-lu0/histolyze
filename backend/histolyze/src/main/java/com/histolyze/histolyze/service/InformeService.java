package com.histolyze.histolyze.service;

import com.histolyze.histolyze.dto.*;
import com.histolyze.histolyze.model.*;
import com.histolyze.histolyze.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Autowired
    private FamiliarRepository familiarRepository;

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

    public InformeFamiliarResponseDTO getDatosInformeFamiliar(String dni) {
        // 1. Buscar Paciente
        Paciente paciente = pacienteRepository.findByDni(dni)
                .orElseThrow(() -> new RuntimeException("Paciente no encontrado con DNI: " + dni));

        // 2. Buscar su HLA más reciente (usado como referencia)
        TipificacionesHLA hlaReferencia = tipificacionesHLARepository.findByPacienteOrderByFechaRegistroDesc(paciente)
                .stream().findFirst()
                .orElse(null); // Puede no tener HLA aún

        // 3. Crear el DTO del paciente (incluso si no tiene HLA)
        FamiliarReporteDTO pacienteDto = new FamiliarReporteDTO(hlaReferencia);
        if(hlaReferencia == null && paciente != null){ // Si no hay HLA, al menos poner el nombre
            pacienteDto.setNombre(paciente.getNombre() + " " + paciente.getApellido());
        }


        // 4. Buscar todos sus familiares
        List<Familiar> familiares = paciente.getFamiliares() != null ? paciente.getFamiliares() : Collections.emptyList();

        // 5. Convertir familiares a DTOs
        List<FamiliarReporteDTO> donantesDto = familiares.stream()
                .map(FamiliarReporteDTO::new) // Usa el constructor que creamos
                .collect(Collectors.toList());

        // 6. Obtener la nota general (desde el HLA de referencia)
        String notaGeneral = (hlaReferencia != null) ? hlaReferencia.getObservacionesFamiliar() : null;
        Long idHlaRef = (hlaReferencia != null) ? hlaReferencia.getIdHla() : null;

        // 7. Construir y devolver la respuesta
        return new InformeFamiliarResponseDTO(pacienteDto, donantesDto, notaGeneral, idHlaRef);
    }

    public void guardarObservacionFamiliar(Long idHlaReferencia, String observaciones) {
        if (idHlaReferencia == null) {
            throw new RuntimeException("No se puede guardar la nota sin un estudio HLA de referencia.");
        }
        // 1. Buscar el registro de Tipificacion HLA usado como referencia
        TipificacionesHLA hla = tipificacionesHLARepository.findById(idHlaReferencia)
                .orElseThrow(() -> new RuntimeException("Registro HLA de referencia no encontrado con ID: " + idHlaReferencia));

        // 2. Settear las observaciones específicas del informe familiar
        hla.setObservacionesFamiliar(observaciones);

        // 3. Guardar la entidad actualizada
        tipificacionesHLARepository.save(hla);
    }
}