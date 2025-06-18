<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoActividad extends Model
{
    use HasFactory;

    protected $table = 'tipo_actividad';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'tipo',
    ];

    protected $casts = [
        'tipo' => 'string',
    ];
}
