<?php

namespace App\Http\Repositories;

use App\Models\Perfil;
use App\Http\Interfaces\PerfilRepositoryInterface;

class PerfilRepository implements PerfilRepositoryInterface
{
    public function getById(int $id)
    {
        return Perfil::where('id_usuario', $id)->first();
    }
}
