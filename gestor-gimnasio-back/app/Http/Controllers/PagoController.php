<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\PagoServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

    public function cargarPago(Request $request)
    {
        $data = $request->validate(
            [
                'idUsuario' => 'required|integer',
                'idFormaPago' => 'required|integer',
                'monto' => 'required|numeric',
            ],
            [
                'idUsuario.required' => 'El ID del usuario es obligatorio.',
                'idFormaPago.required' => 'El ID de la forma de pago es obligatorio.',
                'monto.required' => 'El monto es obligatorio.',
            ]
        );

        $dataTransformed = [
            'usuario_id' => $data['idUsuario'],
            'id_forma_pago' => $data['idFormaPago'],
            'monto' => $data['monto'],
        ];

        $pago = $this->pagoService->cargarPago($dataTransformed);
        return response()->json($pago, Response::HTTP_CREATED);
    }
}
