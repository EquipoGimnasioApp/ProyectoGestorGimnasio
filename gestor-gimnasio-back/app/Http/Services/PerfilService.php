<?php

namespace App\Http\Services;

use App\Http\Interfaces\PerfilRepositoryInterface;
use App\Http\Interfaces\PerfilServiceInterface;

class PerfilService implements PerfilServiceInterface
{
    public function __construct(
        protected PerfilRepositoryInterface $perfilRepositoryInterface
    ) {}

    public function getById(int $id)
    {
        $perfil = $this->perfilRepositoryInterface->getById($id);
        return $perfil;
    }
}
