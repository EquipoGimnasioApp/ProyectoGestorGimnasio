<?php

namespace App\Http\Repositories;

use App\Http\Interfaces\TipoActividadRepositoryInterface;
use App\Models\TipoActividad;

class TipoActividadRepository implements TipoActividadRepositoryInterface
{
    /**
     * Obtener todos los tipos de actividad.
     *
     * @return mixed
     */
    public function getAll()
    {
        return TipoActividad::orderBy('id')->get();
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
        $tipoActividadModel = TipoActividad::findOrFail($id);
        $tipoActividadModel->update($tipoActividad);
        return $tipoActividadModel;
    }

    /**
     * Crear un nuevo tipo de actividad.
     *
     * @param array $tipoActividad
     * @return mixed
     */
    public function create(array $tipoActividad)
    {
        return TipoActividad::create($tipoActividad);
    }

    /**
     * Eliminar un tipo actividad existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        $tipoActividad = TipoActividad::findOrFail($id);
        return $tipoActividad->delete();
    }
}
