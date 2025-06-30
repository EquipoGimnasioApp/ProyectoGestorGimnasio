<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\PagoServiceInterface;

class PagoController extends Controller
{
    protected $pagoService;

    public function __construct(PagoServiceInterface $pagoService)
    {
        $this->pagoService = $pagoService;
    }

    public function historial($id)
    {
        $pagos = $this->pagoService->getHistorialByUsuarioId($id);
        return response()->json($pagos);
    }

    public function index()
    {
        $pagos = $this->pagoService->getAll();

        return response()->json($pagos);
    }
}
