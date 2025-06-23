<?php

namespace App\Models\DTOs;

class TurnoClaseIncriptionStatusDto
{
    public function __construct(
        public int $idTurnoClase,
        public int $idActividad,
        public string $tipoActividad,
        public int $idProfesor,
        public int $idSala,
        public string $descripcionSala,
        public string $nombresProfesor,
        public string $apellidosProfesor,
        public string $fecha,
        public string $horarioDesde,
        public string $horarioHasta,
        public int $cupoMaximo,
        public int $totalInscriptos,
        public bool $inscripto
    ) {}
}
