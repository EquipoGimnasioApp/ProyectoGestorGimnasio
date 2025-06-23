<?php

namespace App\Models\DTOs;

use App\Models\Usuario;
use Carbon\Carbon;

class UsuarioDto
{
    public function __construct(
        public int $id,
        public string $apellidos,
        public string $nombres,
        public string $email,
        public Carbon $fechaAlta,
        public ?Carbon $fechaBaja,
        public int $idTipoUsuario,
        public string $descTipoUsuario,
        public ?string $imagen,
    ) {}

    public static function fromUser(Usuario $user)
    {
        return new self(
            $user->id,
            $user->apellidos,
            $user->nombres,
            $user->email,
            $user->fecha_alta,
            $user->fecha_baja,
            $user->id_tipo_usuario,
            $user->tipoUsuario->tipo ?? '',
            $user->perfil->imagen ?? null,
        );
    }
}
