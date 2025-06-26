<?php

namespace App\Models\DTOs;

class TurnoClaseDto
{
    public function __construct(
        public int $id,
        public int $idActividad,
        public ?string $tipoActividad,
        public int $idProfesor,
        public string $profesor,
        public ?int $idSala,
        public ?string $descripcionSala,
        public string $fecha,
        public string $horarioDesde,
        public string $horarioHasta,
        public int $cupoMaximo
    ) {}

    public static function fromTurnoClase($turnoClase)
    {
        return new self(
            $turnoClase->id,
            $turnoClase->id_actividad,
            $turnoClase->tipoActividad->tipo ?? null,
            $turnoClase->profesor->id,
            $turnoClase->profesor->nombres . ' ' . $turnoClase->profesor->apellidos,
            $turnoClase->sala->id,
            $turnoClase->sala->descripcion ?? '',
            $turnoClase->fecha->format('d/m/Y'),
            $turnoClase->horario_desde->format('H:i'),
            $turnoClase->horario_hasta->format('H:i'),
            $turnoClase->cupo_maximo,
        );
    }
}
