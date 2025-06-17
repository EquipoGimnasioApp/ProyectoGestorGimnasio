<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    use HasFactory;

    protected $table = 'perfil';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'imagen',
        'fecha_nacimiento',
        'telefono',
        'telefono_emergencia',
        'documento_identidad',
        'cobertura_medica',
        'observaciones_salud',
        'pais',
        'ciudad',
        'direccion',
        'codigo_postal',
        'id_usuario',
        'estado_membresia',
    ];

    protected $casts = [
        'imagen' => 'string',
        'fecha_nacimiento' => 'date',
        'telefono' => 'string',
        'telefono_emergencia' => 'string',
        'documento_identidad' => 'string',
        'cobertura_medica' => 'string',
        'observaciones_salud' => 'string',
        'pais' => 'string',
        'ciudad' => 'string',
        'direccion' => 'string',
        'codigo_postal' => 'string',
        'id_usuario' => 'integer',
        'estado_membresia' => 'string',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id');
    }
}
