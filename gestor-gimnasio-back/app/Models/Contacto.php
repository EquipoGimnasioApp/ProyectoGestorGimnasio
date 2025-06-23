<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'contacto';

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
     */
    protected $fillable = [
        'nombres',
        'apellidos',
        'email',
        'asunto',
        'mensaje',
        'rol',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     */
    protected $casts = [
        'fecha_envio' => 'datetime',
    ];

    /**
     * Relación con el modelo Estado.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo(Estado::class, 'id_estado');
    }
}
