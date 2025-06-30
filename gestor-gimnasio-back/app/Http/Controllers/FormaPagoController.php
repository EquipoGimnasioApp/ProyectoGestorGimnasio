<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\FormaPagoService;

class FormaPagoController extends Controller
{
    protected $formaPagoSrv;

    public function __construct(FormaPagoService $formaPagoSrv)
    {
        $this->formaPagoSrv = $formaPagoSrv;
    }

    public function index()
    {
        $formaPago = $this->formaPagoSrv->getAll();
        return response()->json($formaPago);
    }
}
