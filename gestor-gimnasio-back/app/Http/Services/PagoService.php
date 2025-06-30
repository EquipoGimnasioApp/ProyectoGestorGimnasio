<?php

namespace App\Http\Services;

use App\Http\Interfaces\PagoServiceInterface;
use App\Http\Interfaces\PagoRepositoryInterface;

class PagoService implements PagoServiceInterface
{
    public function __construct(
        protected PagoRepositoryInterface $pagoRepository
    ) {}

    public function getHistorialByUsuarioId($usuarioId)
    {
        return $this->pagoRepository->getHistorialByUsuarioId($usuarioId);
    }

    public function getAll()
    {
        return $this->pagoRepository->getAll();
    }
}
