<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Usuario; // Asegúrate de importar el modelo Usuario si es necesario
use App\Models\FormaPago; // Asegúrate de importar el modelo FormaPago si es necesario

class Pago extends Model
{
    protected $table = 'pago'; // Nombre exacto de la tabla
    // Puedes agregar fillable si lo necesitas

    protected $primaryKey = 'id';
    public $timestamps = false; // Si no usas created_at y updated_at

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }

    public function formaPago()
    {
        return $this->belongsTo(FormaPago::class, 'id_forma_pago', 'id');
    }
}