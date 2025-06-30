<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario;
use App\Models\FormaPago;

class Pago extends Model
{
    protected $table = 'pago';
    protected $primaryKey = 'id';
    public $timestamps = false;
    public $fillable = [
        'usuario_id',
        'id_forma_pago',
        'monto',
        'fecha',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id');
    }

    public function formaPago()
    {
        return $this->belongsTo(FormaPago::class, 'id_forma_pago', 'id');
    }
}
