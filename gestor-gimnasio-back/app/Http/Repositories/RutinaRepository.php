<?php

namespace App\Http\Repositories;

use App\Models\Rutina;

use \App\Http\Interfaces\RutinaRepositoryInterface;

class RutinaRepository implements RutinaRepositoryInterface
{
    public function getByUsuario($idUsuario)
    {
        return Rutina::where('id_usuario', $idUsuario)->first();
    }

    public function create(array $data)
    {
        return Rutina::create($data);
    }

    public function update($idUsuario, array $data)
    {
        $rutina = Rutina::where('id_usuario', $idUsuario)->firstOrFail();
        $rutina->update($data);
        return $rutina;
    }

    public function delete($id)
    {
        return Rutina::destroy($id);
    }
}