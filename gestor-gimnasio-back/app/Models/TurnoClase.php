<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TurnoClase extends Model
{
    use HasFactory;

    protected $table = 'turno_clase';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'id_actividad',
        'id_profesor',
        'id_sala',
        'fecha',
        'horario_desde',
        'horario_hasta',
        'cupo_maximo',
    ];

    protected $casts = [
        'id_actividad' => 'integer',
        'id_profesor' => 'integer',
        'id_sala' => 'integer',
        'fecha' => 'date',
        'horario_desde' => 'datetime:H:i',
        'horario_hasta' => 'datetime:H:i',
        'cupo_maximo' => 'integer',
    ];

    public function tipoActividad()
    {
        return $this->belongsTo(TipoActividad::class, 'id_actividad', 'id');
    }

    public function profesor()
    {
        return $this->belongsTo(Usuario::class, 'id_profesor', 'id');
    }

    public function sala()
    {
        return $this->belongsTo(Sala::class, 'id_sala', 'id');
    }

    public function descripcionSala()
    {
        return $this->sala ? $this->sala->descripcion : '';
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_turno_clase', 'id');
    }
}
