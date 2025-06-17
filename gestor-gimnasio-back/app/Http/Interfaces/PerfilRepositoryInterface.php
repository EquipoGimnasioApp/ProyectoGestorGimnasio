<?php

namespace App\Http\Interfaces;

use App\Models\Perfil;

interface PerfilRepositoryInterface
{
    public function getById(int $id);
}
