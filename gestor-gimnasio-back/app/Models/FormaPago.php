<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
    protected $table = 'forma_pago';

    protected $primaryKey = 'id';
    public $timestamps = false; // Si no usas created_at y updated_at

    protected $fillable = [
        'descripcion'
    ];
}