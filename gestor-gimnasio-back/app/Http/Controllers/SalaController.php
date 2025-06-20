<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\SalaServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SalaController extends Controller
{
    public function __construct(
        private readonly SalaServiceInterface $salaService
    ) {}

    /**
     * Obtener todas las salas.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $salas = $this->salaService->getAll();

        return response()->json($salas);
    }

    /**
     * Actualizar una sala existente.
     *
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:50'
        ]);

        $sala = $this->salaService->update($id, $validatedData);

        return response()->json($sala, Response::HTTP_OK);
    }


    /**
     * Crear una nueva sala.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:50',
        ]);

        $sala = $this->salaService->create($validatedData);

        return response()->json($sala, Response::HTTP_CREATED);
    }

    /**
     * Eliminar una sala existente.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $this->salaService->destroy($id);
        return response()->json(['message' => 'Sala eliminada correctamente'], \Illuminate\Http\Response::HTTP_OK);
    }
}
