<?php

namespace App\Http\Interfaces;

interface PagoServiceInterface
{
    public function getHistorialByUsuarioId($usuarioId);
}