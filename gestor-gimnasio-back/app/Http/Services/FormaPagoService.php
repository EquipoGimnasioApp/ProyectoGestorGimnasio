<?php

namespace App\Http\Services;

use App\Http\Repositories\FormaPagoRepository;

class FormaPagoService
{
    protected $formaPagoRepository;

    public function __construct(FormaPagoRepository $formaPagoRepository)
    {
        $this->formaPagoRepository = $formaPagoRepository;
    }

    public function getAll()
    {
        return $this->formaPagoRepository->getAll();
    }
}
