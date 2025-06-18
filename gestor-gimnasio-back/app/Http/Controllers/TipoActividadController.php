<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\TipoActividadServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TipoActividadController extends Controller
{
    public function __construct(
        private readonly TipoActividadServiceInterface $tipo_actividad_service
    ) {}

    /**
     * Obtener todos los tipos de actividad.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $tiposActividad = $this->tipo_actividad_service->getAll();

        return response()->json($tiposActividad, Response::HTTP_OK);
    }

    /**
     * Actualizar un tipo de actividad existente.
     *
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, Request $request)
    {
        $validatedData = $request->validate([
            'tipo' => 'required|string|max:255',
        ]);

        $tipoActividad = $this->tipo_actividad_service->update($id, $validatedData);

        return response()->json($tipoActividad, Response::HTTP_OK);
    }

    /**
     * Crear un nuevo tipo de actividad.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'tipo' => 'required|string|max:255'
        ]);

        $tipoActividad = $this->tipo_actividad_service->create($validatedData);

        return response()->json($tipoActividad, Response::HTTP_CREATED);
    }

    /**
     * Eliminar un tipo actividad existente.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $this->tipo_actividad_service->destroy($id);
        return response()->json(['message' => 'Actividad eliminada correctamente'], \Illuminate\Http\Response::HTTP_OK);
    }
}
