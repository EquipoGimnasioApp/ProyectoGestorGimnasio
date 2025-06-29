<?php

namespace App\Http\Services;

use App\Http\Interfaces\PerfilRepositoryInterface;
use App\Http\Interfaces\PerfilServiceInterface;
use Illuminate\Support\Facades\Log;

class PerfilService implements PerfilServiceInterface
{
    public function __construct(
        protected PerfilRepositoryInterface $perfilRepository
    ) {}

    public function getByUserId(int $id)
    {
        return $this->perfilRepository->getByUserId($id);
    }

    public function createForUser(int $userId)
    {
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

    public function update(int $userId, array $data)
    {
        Log::info('PerfilService@update: Llamando a repository para actualizar perfil', ['userId' => $userId, 'data' => $data]);
        $result = $this->perfilRepository->update($userId, $data);
        Log::info('PerfilService@update: Resultado de la actualización', ['result' => $result]);
        return $result;
    }
}
