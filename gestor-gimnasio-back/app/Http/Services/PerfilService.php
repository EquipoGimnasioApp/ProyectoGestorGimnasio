<?php

namespace App\Http\Services;

use App\Http\Interfaces\PerfilRepositoryInterface;
use App\Http\Interfaces\PerfilServiceInterface;

class PerfilService implements PerfilServiceInterface
{
    public function __construct(
        protected PerfilRepositoryInterface $perfilRepository
    ) {}

    public function getByUserId(int $id)
    {
        $perfil = $this->perfilRepository->getByUserId($id);
        return $perfil;
    }

    public function createForUser(int $userId)
    {
        // Aquí podrías implementar la lógica para crear un perfil para un usuario.
        // Por ejemplo, podrías llamar a un método en el repositorio para guardar el perfil.
        return $this->perfilRepository->create([
            'id_usuario' => $userId,
            'fecha_nacimiento' => null,
            'telefono' => null,
            'telefono_emergencia' => null,
            'tipo_documento' => null,
            'documento_identidad' => null,
            'cobertura_medica' => null,
            'observaciones_salud' => null,
            'direccion' => null,
            'ciudad' => null,
            'codigo_postal' => null,
            'pais' => null,
            'estado_membresia' => 'PENDIENTE',
        ]);
    }

    /* public function updateForUser($userId, $data)
    {
        return $this->perfilRepository->updateForUser($userId, $data);
    } */
}
