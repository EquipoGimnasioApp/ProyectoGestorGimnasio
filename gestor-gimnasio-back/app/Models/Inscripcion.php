<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    protected $table = 'inscripcion';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_turno_clase',
        'fecha',
        'presente'
    ];

    protected $casts = [
        'id_usuario' => 'integer',
        'id_turno_clase' => 'integer',
        'fecha' => 'date',
        'presente' => 'boolean'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id');
    }

    public function turnoClase()
    {
        return $this->belongsTo(TurnoClase::class, 'id_turno_clase', 'id');
    }
}
