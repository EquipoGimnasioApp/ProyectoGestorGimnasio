<?php

namespace App\Models\DTOs;

class TipoActividadDto
{
    public function __construct(
        public int $id,
        public string $tipo,

    ) {}

    public static function fromTipoActividad($tipoActividad)
    {
        return new self(
            $tipoActividad->id,
            $tipoActividad->tipo,
        );
    }
}
