<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
    protected $table = 'forma_pago';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'descripcion'
    ];
}
