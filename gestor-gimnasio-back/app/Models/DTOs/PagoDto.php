<?php

namespace App\Models\DTOs;

use App\Models\Pago;
use Carbon\Carbon;

class PagoDto
{
    public function __construct(
        public int $id,
        public Carbon $fecha,
        public decimal $monto,
        public int $id_forma_pago,
        public int $id_usuario,
        public string $descripcionFormaPago,
    ) {}

    public static function fromUser(Pago $pago)
    {
        return new self(
            $pago->id,
            $pago->fecha,
            $pago->monto,
            $pago->usuario_id,
            $pago->formaPago->id,
            $pago->id_forma_pago,
            $pago->formaPago->descripcion ?? '',
        );
    }
}
