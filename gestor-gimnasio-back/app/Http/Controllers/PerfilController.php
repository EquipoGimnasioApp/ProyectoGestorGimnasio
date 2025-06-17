<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\PerfilServiceInterface;

class PerfilController extends Controller
{
    public function __construct(
        protected PerfilServiceInterface $perfilSrv
    ) {
        $this->perfilSrv = $perfilSrv;
    }


    public function show(int $id)
    {
        $perfil = $this->perfilSrv->getById($id);

        if ($perfil) {
            return response()->json($perfil);
        }
        return response()->json(['message' => 'Perfil con ID ' . $id . ' no encontrado'], 404);
    }
}
