<?php

namespace App\Http\Interfaces;

use Illuminate\Support\Collection;
use App\Models\Usuario;
use App\Models\DTOs\UsuarioDto;

interface UsuarioServiceInterface
{
    /**
     * Obtener todos los usuarios como DTOs.
     *
     * @return \Illuminate\Support\Collection Una colección de UsuarioDto.
     */
    public function getAll(): Collection;

    /**
     * Obtener un usuario por su ID como DTO.
     *
     * @param int $id El ID del usuario.
     * @return \App\Models\DTOs\UsuarioDto|null El UsuarioDto encontrado o null si no se encuentra.
     */
    public function getById(int $id): ?UsuarioDto;

    /**
     * Obtener todos los usuarios que son profesores.
     *
     * @return \Illuminate\Database\Eloquent\Collection Una colección de usuarios que son profesores.
     */
    public function getProfesores();

    public function getAlumnos();

    /**
     * Verifica si un correo electrónico ya existe en la base de datos.
     *
     * @param string $email El correo electrónico a verificar.
     * @return bool True si el correo electrónico existe, false en caso contrario.
     */
    public function checkEmailExists(string $email): bool;

    /**
     * Crear un nuevo usuario.
     *
     * @param array $data Los datos del nuevo usuario.
     * @return \App\Models\Usuario El usuario creado.
     */
    public function create(array $data): Usuario;
}
