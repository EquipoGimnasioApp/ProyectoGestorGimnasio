<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mensaje extends Model
{
    protected $table = 'mensaje';
    public $timestamps = false;

    protected $fillable = [
        'remitente_id',
        'destinatario_id',
        'asunto',
        'mensaje',
        'fecha_envio',
        'leido'
    ];
}
