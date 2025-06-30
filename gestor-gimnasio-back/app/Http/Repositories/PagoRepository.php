<?php

namespace App\Http\Repositories;

use App\Models\Pago;
use App\Models\FormaPago;
use App\Http\Interfaces\PagoRepositoryInterface;

class PagoRepository implements PagoRepositoryInterface
{
    public function getHistorialByUsuarioId($usuarioId)
    {
        return Pago::where('usuario_id', $usuarioId)
            ->with('formaPago')
            ->orderBy('fecha', 'desc')
            ->get();
    }

    public function save(array $data)
    {
        return Pago::create($data);
    }
}
