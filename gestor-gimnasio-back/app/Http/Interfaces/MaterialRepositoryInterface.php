<?php

namespace App\Http\Interfaces;

interface MaterialRepositoryInterface
{
    /**
     * Obtiene todo el equipamiento disponible del sistema.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array Colección de todos los materiales registrados
     */
    public function getAll();

    /**
     * Actualizar un material existente.
     * @param int $id
     * @param array $material
     * @return mixed
     */
    public function update(int $id, array $material);

    /**
     * Crear un nuevo material.
     * @param array $material
     * @return mixed
     */
    public function create(array $material);

    /**
     * Eliminar un material existente.
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id);
}
