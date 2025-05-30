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
}
