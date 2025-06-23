<?php

namespace App\Http\Repositories;

use App\Models\Perfil;
use App\Http\Interfaces\PerfilRepositoryInterface;
use Illuminate\Support\Facades\Log;

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


    public function update(int $userId, array $data)
    {
        Log::info('PerfilRepository@update: Intentando actualizar perfil', ['userId' => $userId, 'data' => $data]);
        $perfil = $this->getByUserId($userId);
        if ($perfil) {
            Log::info('PerfilRepository@update: Perfil encontrado', ['perfil' => $perfil]);
            $perfil->update($data);
            Log::info('PerfilRepository@update: Perfil actualizado correctamente');
            return $perfil;
        }
        Log::warning('PerfilRepository@update: Perfil no encontrado', ['userId' => $userId]);
        return null;
    }
}
