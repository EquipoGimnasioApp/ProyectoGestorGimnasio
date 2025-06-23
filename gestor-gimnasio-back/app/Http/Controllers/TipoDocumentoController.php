<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\TipoDocumentoService;

class TipoDocumentoController extends Controller
{
    protected $tipoDocumentoSrv;

    public function __construct(TipoDocumentoService $tipoDocumentoSrv)
    {
        $this->tipoDocumentoSrv = $tipoDocumentoSrv;
    }

    public function index()
    {
        $tiposDocumento = $this->tipoDocumentoSrv->getAll();
        return response()->json($tiposDocumento);
    }
}
