<?php

namespace App\Http\Interfaces;

interface TipoActividadRepositoryInterface
{
    /**
     * Obtener todos los tipos de actividad.
     * @return mixed
     */
    public function getAll();

    /**
     * Actualizar un tipo de actividad existente.
     * @param int $id
     * @param array $tipoActividad
     * @return mixed
     */
    public function update(int $id, array $tipoActividad);

    /**
     * Crear un nuevo tipo de actividad.
     * @param array $tipoActividad
     * @return mixed
     */
    public function create(array $tipoActividad);

    /**
     * Eliminar un tipo actividad existente.
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id);
}
