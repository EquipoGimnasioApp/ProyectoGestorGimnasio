<?php

namespace App\Http\Repositories;

use App\Models\Usuario;
use App\Http\Interfaces\UsuarioRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class UsuarioRepository implements UsuarioRepositoryInterface
{
    /**
     * Obtener todos los usuarios.
     *
     * @return \Illuminate\Database\Eloquent\Collection Una colección de todos los usuarios.
     */
    public function getAll(): Collection
    {
        return Usuario::with('tipoUsuario')
            ->orderBy('id')
            ->get();
    }

    /**
     * Obtener un usuario por su ID.
     *
     * @param int $id El ID del usuario.
     * @return \App\Models\Usuario|null El usuario encontrado o null si no se encuentra.
     */
    public function getById(int $id): ?Usuario
    {
        return Usuario::with('tipoUsuario')
            ->where('id', $id)
            ->first();
    }

    /**
     * Obtener un usuario por su email.
     *
     * @param string $email El email del usuario.
     * @return \App\Models\Usuario|null El usuario encontrado o null si no se encuentra.
     */
    public function getByEmail(string $email): ?Usuario
    {
        return Usuario::with('tipoUsuario')
            ->where('email', $email)
            ->first();
    }

    /**
     * Obtener todos los usuarios que son profesores.
     *
     * @return \Illuminate\Database\Eloquent\Collection Una colección de usuarios que son profesores.
     */
    public function getProfesores()
    {
        return Usuario::with('tipoUsuario')
            ->where('id_tipo_usuario', 3)
            ->orderBy('id')
            ->get();
    }

    /**
     * Obtener todos los usuarios que son alumnos.
     *
     * @return \Illuminate\Database\Eloquent\Collection Una colección de usuarios que son alumnos.
     */
    public function getAlumnos()
    {
        return Usuario::with('tipoUsuario')
            ->where('id_tipo_usuario', 2)
            ->orderBy('id')
            ->get();
    }

    /**
     * Verifica si un correo electrónico ya existe en la base de datos.
     *
     * @param string $email El correo electrónico a verificar.
     * @return bool True si el correo electrónico existe, false en caso contrario.
     */
    public function checkEmailExists(string $email): bool
    {
        return Usuario::where('email', $email)->exists();
    }

    /**
     * Crear un nuevo usuario.
     *
     * @param array $data Los datos del nuevo usuario.
     * @return \App\Models\Usuario El usuario creado.
     */
    public function create(array $data): Usuario
    {
        return Usuario::create($data);
    }

    /**
     * Actualizar un usuario existente.
     *
     * @param int $id El ID del usuario a actualizar.
     * @param array $data Los nuevos datos del usuario.
     * @return \App\Models\Usuario|null El usuario actualizado o null si no se encuentra.
     */
    public function update(int $id, array $data): ?Usuario
    {
        $usuario = $this->getById($id);

        if ($usuario) {
            $usuario->update($data);
            return $usuario;
        }

        return null;
    }

    /**
     * Eliminar un usuario por su ID.
     *
     * @param int $id El ID del usuario a eliminar.
     * @return bool Verdadero si se eliminó correctamente, falso de lo contrario.
     */
    public function delete(int $id): bool
    {
        $usuario = $this->getById($id);

        if ($usuario) {
            return $usuario->delete();
        }

        return false;
    }
}
