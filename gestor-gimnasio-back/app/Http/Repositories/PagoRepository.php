<?php

namespace App\Http\Repositories;

use App\Models\Pago;
use App\Http\Interfaces\PagoRepositoryInterface;

class PagoRepository implements PagoRepositoryInterface
{
    public function getHistorialByUsuarioId($usuarioId)
    {
        return Pago::where('usuario_id', $usuarioId)
            ->orderBy('fecha', 'desc')
            ->get();
    }
}