<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'usuario';

    /**
     * La clave primaria asociada con la tabla.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Indica si el modelo debe ser marcado con tiempo.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Los atributos que se pueden asignar masivamente.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'apellidos',
        'nombres',
        'email',
        'password',
        'id_tipo_usuario',
        'id_usuario',
    ];

    /**
     * Los atributos que deben ser ocultados para los arreglos y JSON.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_alta' => 'datetime',
        'fecha_baja' => 'datetime',
        'id_tipo_usuario' => 'integer',
        'id_usuario' => 'integer',
    ];

    /**
     * Obtiene el tipo de usuario asociado al usuario.
     */
    public function tipoUsuario()
    {
        return $this->belongsTo(TipoUsuario::class, 'id_tipo_usuario', 'id');
    }

    public function getDescTipoUsuarioAttribute()
{
    return $this->tipoUsuario ? $this->tipoUsuario->tipo : null;
}
    public function perfil()
    {
        return $this->hasOne(Perfil::class, 'id_usuario');
    }
}
