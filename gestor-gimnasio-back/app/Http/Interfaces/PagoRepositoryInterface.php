<?php

namespace App\Http\Interfaces;

interface PagoRepositoryInterface
{
    public function getHistorialByUsuarioId($usuarioId);

    public function getAll();
    public function save(array $data);
}
