<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\MaterialServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MaterialController extends Controller
{
    public function __construct(
        private readonly MaterialServiceInterface $materialService
    ) {}

    /**
     * Obtener todo el equipamiento disponible.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $equipamiento = $this->materialService->getAll();

        return response()->json($equipamiento);
    }

    /**
     * Actualizar un material existente.
     *
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(int $id, Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
        ]);

        $material = $this->materialService->update($id, $validatedData);

        return response()->json($material, Response::HTTP_OK);
    }

    /**
     * Crear un nuevo material.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'descripcion' => 'required|string|max:100',
            'stock' => 'required|integer|min:0',
        ]);

        $material = $this->materialService->create($validatedData);

        return response()->json($material, Response::HTTP_CREATED);
    }

    /**
     * Eliminar un material existente.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $this->materialService->destroy($id);
        return response()->json(['message' => 'Material eliminado correctamente'], \Illuminate\Http\Response::HTTP_OK);
    }
}
