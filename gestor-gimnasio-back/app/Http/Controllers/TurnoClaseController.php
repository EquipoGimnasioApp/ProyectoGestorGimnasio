<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\TurnoClaseServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

if (!defined('REQUIRED_NUMERIC')) {
    define('REQUIRED_NUMERIC', 'required|numeric');
}

class TurnoClaseController extends Controller
{
    public function __construct(
        private readonly TurnoClaseServiceInterface $turnoClaseService
    ) {}

    public function getAll()
    {
        $turnos = $this->turnoClaseService->getAll();
        return response()->json($turnos, Response::HTTP_OK);
    }

    public function getAllWithUserInscriptionStatus(int $userId)
    {
        $turnos = $this->turnoClaseService->getAllWithUserInscriptionStatus($userId);
        return response()->json($turnos, Response::HTTP_OK);
    }

    public function getCupoMaximoFromTurnoClase(int $idTurnoClase)
    {
        $cupoMaximo = $this->turnoClaseService->getCupoMaximoFromTurnoClase($idTurnoClase);
        return response($cupoMaximo, Response::HTTP_OK)
            ->header('Content-Type', 'application/json');
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate(
            [
                'id_actividad' => REQUIRED_NUMERIC,
                'id_profesor' => REQUIRED_NUMERIC,
                'id_sala' => REQUIRED_NUMERIC,
                'fecha' => 'required|date',
                'horario_desde' => 'required|date_format:H:i:s',
                'horario_hasta' => 'required|date_format:H:i:s|after:horarioDesde',
                'cupo_maximo' => 'required|numeric|min:1',
            ],
            [
                'id_actividad.required' => 'El ID de actividad es obligatorio.',
                'id_profesor.required' => 'El ID de profesor es obligatorio.',
                'id_sala.required' => 'El ID de sala es obligatorio.',
                'fecha.required' => 'La fecha es obligatoria.',
                'fecha.date' => 'La fecha debe ser una fecha válida.',
                'horario_desde.required' => 'El horario desde es obligatorio.',
                'horario_desde.date_format' => 'El formato del horario desde debe ser H:i:s.',
                'horario_hasta.required' => 'El horario hasta es obligatorio.',
                'horario_hasta.date_format' => 'El formato del horario hasta debe ser H:i:s.',
                'horario_hasta.after' => 'El horario hasta debe ser posterior al horario desde.',
                'cupo_maximo.min' => 'El cupo máximo debe ser al menos 1.',
                'cupo_maximo.numeric' => 'El cupo máximo debe ser un número.',
            ]
        );

        $turnoClase = $this->turnoClaseService->create($validatedData);
        return response()->json($turnoClase, Response::HTTP_CREATED);
    }

    public function update(int $idTurnoClase, Request $request)
    {
        $validatedData = $request->validate([
           'id_actividad' => REQUIRED_NUMERIC,
            'id_profesor' => 'required|numeric|exists:usuario,id',
            'id_sala' => 'required|numeric|exists:sala,id',
            'fecha' => 'required|date',
            'horario_desde' => 'required|date_format:H:i:s',
            'horario_hasta' => 'required|date_format:H:i:s|after:horario_desde',
            'cupo_maximo' => 'required|numeric|min:1',
        ]);

        $turnoClase = $this->turnoClaseService->update($idTurnoClase, $validatedData);
        return response()->json($turnoClase, Response::HTTP_OK);
    }

    /**
     * Eliminar una clase existente.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $this->turnoClaseService->destroy($id);
        return response()->json(['message' => 'Clase eliminada correctamente'], \Illuminate\Http\Response::HTTP_OK);
    }
}
