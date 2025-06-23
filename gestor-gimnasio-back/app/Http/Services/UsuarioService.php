<?php

namespace App\Http\Services;

use App\Http\Interfaces\UsuarioRepositoryInterface;
use App\Http\Interfaces\UsuarioServiceInterface;
use App\Http\Interfaces\PerfilServiceInterface;
use App\Models\DTOs\UsuarioDto;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;

class UsuarioService implements UsuarioServiceInterface
{
    public function __construct(
        protected UsuarioRepositoryInterface $usuarioRepoInterface,
        protected PerfilServiceInterface $perfilService
    ) {}

    public function getAll(): Collection
    {
        $usuarios = $this->usuarioRepoInterface->getAll();
        return $usuarios->map(function (Usuario $usuario) {
            return UsuarioDto::fromUser($usuario);
        });
    }

    public function getById(int $id): ?UsuarioDto
    {
        $usuario = $this->usuarioRepoInterface->getById($id);

        if ($usuario) {
            return UsuarioDto::fromUser($usuario);
        }

        return null;
    }

    /**
     * Obtener todos los usuarios que son profesores.
     *
     * @return \Illuminate\Database\Eloquent\Collection Una colección de usuarios que son profesores.
     */
    public function getProfesores()
    {
        $profesores = $this->usuarioRepoInterface->getProfesores();
        return $profesores->map(function (Usuario $usuario) {
            return UsuarioDto::fromUser($usuario);
        });
    }

    public function checkEmailExists(string $email): bool
    {
        return $this->usuarioRepoInterface->checkEmailExists($email);
    }

    public function create(array $data): Usuario
    {
        $data['password'] = Hash::make($data['password']);
        $usuario = $this->usuarioRepoInterface->create($data);
        $this->perfilService->createForUser($usuario->id);
        return $usuario;
    }
}
