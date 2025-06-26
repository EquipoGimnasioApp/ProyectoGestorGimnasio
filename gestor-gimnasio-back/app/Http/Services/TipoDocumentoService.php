<?php

namespace App\Http\Services;

use App\Http\Repositories\TipoDocumentoRepository;

class TipoDocumentoService
{
    protected $tipoDocumentoRepository;

    public function __construct(TipoDocumentoRepository $tipoDocumentoRepository)
    {
        $this->tipoDocumentoRepository = $tipoDocumentoRepository;
    }

    public function getAll()
    {
        return $this->tipoDocumentoRepository->getAll();
    }
}
