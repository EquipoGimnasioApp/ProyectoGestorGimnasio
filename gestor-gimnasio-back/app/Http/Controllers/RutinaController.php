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

    // Agrega aquí los métodos create, update, destroy si los necesitas
}