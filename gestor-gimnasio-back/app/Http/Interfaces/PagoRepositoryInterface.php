<?php

namespace App\Http\Interfaces;

interface PagoRepositoryInterface
{
    public function getHistorialByUsuarioId($usuarioId);
}