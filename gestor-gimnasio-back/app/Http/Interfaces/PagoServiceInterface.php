<?php

namespace App\Http\Interfaces;

interface PagoServiceInterface
{
    public function getHistorialByUsuarioId($usuarioId);
    public function getAll();
    public function cargarPago(array $data);
}
