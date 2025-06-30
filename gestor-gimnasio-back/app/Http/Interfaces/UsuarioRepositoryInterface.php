<?php

namespace App\Http\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use App\Models\Usuario;

interface UsuarioRepositoryInterface
{
    /**
     * Obtener todos los usuarios.
     *
     * @return \Illuminate\Database\Eloquent\Collection Una colección de todos los usuarios.
     */
    public function getAll(): Collection;

    /**
     * Obtener un usuario por su ID.
     *
     * @param int $id El ID del usuario.
     * @return \App\Models\Usuario|null El usuario encontrado o null si no se encuentra.
     */
    public function getById(int $id): ?Usuario;

    /**
     * Obtener un usuario por su email.
     *
     * @param string $email El email del usuario.
     * @return \App\Models\Usuario|null El usuario encontrado o null si no se encuentra.
     */
    public function getByEmail(string $email): ?Usuario;

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

    /**
     * Actualizar un usuario existente.
     *
     * @param int $id El ID del usuario a actualizar.
     * @param array $data Los nuevos datos del usuario.
     * @return \App\Models\Usuario|null El usuario actualizado o null si no se encuentra.
     */
    public function update(int $id, array $data): ?Usuario;

    /**
     * Eliminar un usuario por su ID.
     *
     * @param int $id El ID del usuario a eliminar.
     * @return bool Verdadero si se eliminó correctamente, falso de lo contrario.
     */
    public function delete(int $id): bool;
}
