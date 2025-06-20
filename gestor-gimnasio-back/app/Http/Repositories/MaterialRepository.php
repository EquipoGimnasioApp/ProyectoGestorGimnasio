<?php

namespace App\Http\Repositories;

use App\Http\Interfaces\MaterialRepositoryInterface;
use App\Models\Material;

class MaterialRepository implements MaterialRepositoryInterface
{
    /**
     * Obtiene todo el equipamiento disponible del sistema.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array Colección de todos los materiales registrados
     */
    public function getAll()
    {
        return Material::orderBy('id')->get();
    }

    /**
     * Actualizar un material existente.
     *
     * @param int $id
     * @param array $material
     * @return mixed
     */
    public function update(int $id, array $material): Material
    {
        $materialModel = Material::findOrFail($id);
        $materialModel->update($material);
        return $materialModel;
    }

    /**
     * Crear un nuevo material.
     *
     * @param array $material
     * @return mixed
     */
    public function create(array $material)
    {
        return Material::create($material);
    }

    /**
     * Eliminar un material existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        $material = Material::findOrFail($id);
        return $material->delete();
    }
}
