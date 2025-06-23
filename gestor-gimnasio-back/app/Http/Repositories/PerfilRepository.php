<?php

namespace App\Http\Repositories;

use App\Models\Perfil;
use App\Http\Interfaces\PerfilRepositoryInterface;

class PerfilRepository implements PerfilRepositoryInterface
{
    public function getByUserId(int $id)
    {
        return Perfil::where('id_usuario', $id)->first();
    }

    public function create(array $data)
    {
        return Perfil::create($data);
    }
    /*  public function updateForUser(int $userId, array $data)
    {
        $perfil = $this->getByUserId($userId);
        if ($perfil) {
            $perfil->update($data);
            return $perfil;
        }
        return null;
    } */
}
