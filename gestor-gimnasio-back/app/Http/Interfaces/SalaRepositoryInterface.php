<?php

namespace App\Http\Interfaces;

interface SalaRepositoryInterface
{
    /**
     * Obtiene todas las salas disponibles en el sistema.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array Colección de todas las salas registradas
     */
    public function getAll();

    /**
     * Actualizar una sala existente.
     * @param int $id
     * @param array $sala
     * @return mixed
     */
    public function update(int $id, array $sala);

    /**
     * Crear una nueva sala.
     * @param array $sala
     * @return mixed
     */
    public function create(array $sala);

    /**
     * Eliminar una sala existente.
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id);
}
