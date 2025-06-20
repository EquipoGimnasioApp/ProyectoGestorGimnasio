<?php

namespace App\Http\Services;

use App\Http\Interfaces\TipoActividadRepositoryInterface;
use App\Http\Interfaces\TipoActividadServiceInterface;
use App\Models\DTOs\TipoActividadDto;

class TipoActividadService implements TipoActividadServiceInterface
{
    public function __construct(
        private readonly TipoActividadRepositoryInterface $tipo_actividad_repository,
    ) {}

    /**
     * Obtener todos los tipos de actividad.
     *
     * @return mixed
     */
    public function getAll()
    {
        $tipos_actividad = $this->tipo_actividad_repository->getAll();
        return $tipos_actividad->map(function ($tipo_actividad) {
            return TipoActividadDto::fromTipoActividad($tipo_actividad);
        });
    }

    /**
     * Actualizar un tipo de actividad existente.
     *
     * @param int $id
     * @param array $tipoActividad
     * @return mixed
     */
    public function update(int $id, array $tipoActividad)
    {
        $tipoActividadModel = $this->tipo_actividad_repository->update($id, $tipoActividad);
        return TipoActividadDto::fromTipoActividad($tipoActividadModel);
    }

    /**
     * Crear un nuevo tipo de actividad.
     *
     * @param array $tipoActividad
     * @return mixed
     */
    public function create(array $tipoActividad)
    {
        return $this->tipo_actividad_repository->create($tipoActividad);
    }

    /**
     * Eliminar un tipo actividad existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        return $this->tipo_actividad_repository->destroy($id);
    }
}
