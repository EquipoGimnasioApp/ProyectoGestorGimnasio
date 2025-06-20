<?php

namespace App\Http\Services;

use App\Http\Interfaces\MaterialRepositoryInterface;
use App\Http\Interfaces\MaterialServiceInterface;

class MaterialService implements MaterialServiceInterface
{
    public function __construct(
        private readonly MaterialRepositoryInterface $material_repository,
    ) {}

    /**
     * Obtiene todo el equipamiento del sistema.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array Colección de todos los materiales registrados
     */
    public function getAll()
    {
        return $this->material_repository->getAll();
    }

    /**
     * Actualizar un material existente.
     *
     * @param int $id
     * @param array $material
     * @return mixed
     */
    public function update(int $id, array $material): mixed
    {
        return $this->material_repository->update($id, $material);
    }

    /**
     * Crear un nuevo material.
     *
     * @param array $material
     * @return mixed
     */
    public function create(array $material)
    {
        return $this->material_repository->create($material);
    }

    /**
     * Eliminar un material existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        return $this->material_repository->destroy($id);
    }
}
