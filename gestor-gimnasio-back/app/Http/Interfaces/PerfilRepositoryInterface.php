<?php

namespace App\Http\Interfaces;

use App\Models\Perfil;

interface PerfilRepositoryInterface
{
    public function getByUserId(int $id);

    public function create(array $data);

    public function update(int $userId, array $data);
}
