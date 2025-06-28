<?php

namespace App\Http\Services;

use App\Http\Interfaces\TurnoClaseRepositoryInterface;
use App\Http\Interfaces\TurnoClaseServiceInterface;
use App\Models\DTOs\TurnoClaseDto;
use App\Models\DTOs\TurnoClaseIncriptionStatusDto;
use Illuminate\Http\Response;

class TurnoClaseService implements TurnoClaseServiceInterface
{
    public function __construct(
        private readonly TurnoClaseRepositoryInterface $turnoClaseRepository
    ) {}

    public function getAll()
    {
        $turnos_clase = $this->turnoClaseRepository->getAll();
        return $turnos_clase->map(function ($turno) {
            return TurnoClaseDto::fromTurnoClase($turno);
        });
    }

    public function getAllWithUserInscriptionStatus(int $userId)
    {
        $turnos = $this->turnoClaseRepository->getAllWithUserInscriptionStatus($userId);

        return $turnos->map(function ($turno) {
            return new TurnoClaseIncriptionStatusDto(
                idTurnoClase: $turno->idTurnoClase,
                idActividad: $turno->idActividad,
                tipoActividad: $turno->tipoActividad,
                idProfesor: $turno->idProfesor,
                nombresProfesor: $turno->nombresProfesor,
                apellidosProfesor: $turno->apellidosProfesor,
                idSala: $turno->idSala,
                descripcionSala: $turno->descripcionSala,
                fecha: $turno->fecha,
                horarioDesde: $turno->horarioDesde,
                horarioHasta: $turno->horarioHasta,
                cupoMaximo: $turno->cupoMaximo,
                totalInscriptos: $turno->totalInscriptos,
                inscripto: $turno->inscripto
            );
        });
    }

    public function getCupoMaximoFromTurnoClase(int $idTurnoClase): int
    {
        return $this->turnoClaseRepository->getCupoMaximoFromTurnoClase($idTurnoClase);
    }

    public function create(array $turnoClase)
    {
        $turnosFechaHorario = $this->turnoClaseRepository->getTurnosByFechaHorario(
            $turnoClase['fecha'],
            $turnoClase['horario_desde'],
            $turnoClase['horario_hasta']
        );

        if ($turnosFechaHorario > 0) {
            throw new TurnoFechaHorarioException('Ya existe un turno de clase para la fecha y horario especificados');
        }

        return $this->turnoClaseRepository->create($turnoClase);
    }

    public function update(int $idTurnoClase, array $turnoClase)
    {
        return $this->turnoClaseRepository->update($idTurnoClase, $turnoClase);
    }

    /**
     * Eliminar una clase existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        return $this->turnoClaseRepository->destroy($id);
    }

    public function getClasesPorProfesor($idProfesor)
    {
        $clases = $this->turnoClaseRepository->getClasesPorProfesor($idProfesor);
        return $clases->map(function ($turno) {
            return \App\Models\DTOs\TurnoClaseDto::fromTurnoClase($turno);
        });
    }
}

class TurnoFechaHorarioException extends \Exception
{
    public function __construct($message = null, $code = Response::HTTP_BAD_REQUEST)
    {
        parent::__construct($message ?? $this->message, $code);
    }
}
