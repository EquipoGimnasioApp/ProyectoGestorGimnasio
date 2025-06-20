<?php

namespace App\Http\Repositories;

use App\Http\Interfaces\SalaRepositoryInterface;
use App\Models\Sala;

class SalaRepository implements SalaRepositoryInterface
{
    /**
     * Obtiene todas las salas disponibles en el sistema.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array Colección de todas las salas registradas
     */
    public function getAll()
    {
        return Sala::orderBy('id')->get();
    }

    /**
     * Actualizar una sala existente.
     *
     * @param int $id
     * @param array $sala
     * @return mixed
     */
    public function update(int $id, array $sala): Sala
    {
        $salaModel = Sala::findOrFail($id);
        $salaModel->update($sala);
        return $salaModel;
    }

    /**
     * Crear una nueva sala.
     *
     * @param array $sala
     * @return mixed
     */
    public function create(array $sala)
    {
        return Sala::create($sala);
    }

    /**
     * Eliminar una sala existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        $sala = Sala::findOrFail($id);
        return $sala->delete();
    }
}
