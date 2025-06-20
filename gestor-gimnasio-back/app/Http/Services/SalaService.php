<?php

namespace App\Http\Services;

use App\Http\Interfaces\SalaRepositoryInterface;
use App\Http\Interfaces\SalaServiceInterface;

class SalaService implements SalaServiceInterface
{
    public function __construct(
        private readonly SalaRepositoryInterface $sala_repository,
    ) {}

    /**
     * Obtiene todas las salas disponibles en el sistema.
     *
     * @return \Illuminate\Database\Eloquent\Collection|array Colección de todas las salas registradas
     */
    public function getAll()
    {
        return $this->sala_repository->getAll();
    }

    /**
     * Actualizar una sala existente.
     *
     * @param int $id
     * @param array $sala
     * @return mixed
     */
    public function update(int $id, array $sala): mixed
    {
        return $this->sala_repository->update($id, $sala);
    }

    /**
     * Crear una nueva sala.
     *
     * @param array $sala
     * @return mixed
     */
    public function create(array $sala)
    {
        return $this->sala_repository->create($sala);
    }

    /**
     * Eliminar una sala existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        return $this->sala_repository->destroy($id);
    }
}
