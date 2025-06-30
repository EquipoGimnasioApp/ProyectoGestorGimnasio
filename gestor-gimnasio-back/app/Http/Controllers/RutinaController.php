<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Services\RutinaService;
use App\Models\Rutina;

class RutinaController extends Controller
{
    protected $rutinaService;

    public function __construct(RutinaService $rutinaService)
    {
        $this->rutinaService = $rutinaService;
    }

    public function getByUsuario($usuarioId)
    {
        $rutina = $this->rutinaService->getByUsuario($usuarioId);
        return response()->json($rutina, Response::HTTP_OK);
    }

    public function create(Request $request, $usuarioId)
    {
        $data = $request->validate([
            'descripcion' => 'required|string|max:300',
        ]);
        $data['id_usuario'] = $usuarioId;
        $rutina = $this->rutinaService->create($data);
        return response()->json($rutina, Response::HTTP_CREATED);
    }

    public function update($idUsuario, Request $request)
    {
        $data = $request->validate([
            'descripcion' => 'required|string|max:300',
        ]);
        $rutina = $this->rutinaService->update($idUsuario, $data);
        return response()->json($rutina, Response::HTTP_OK);
    }

    public function destroy($id)
    {
        $this->rutinaService->delete($id);
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
    // Agrega aquí los métodos create, update, destroy si los necesitas
}