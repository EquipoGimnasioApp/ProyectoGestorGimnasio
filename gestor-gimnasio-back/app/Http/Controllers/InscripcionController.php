<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\InscripcionServiceInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InscripcionController extends Controller
{
    public function __construct(
        private readonly InscripcionServiceInterface $inscripcionService
    ) {}

    public function inscribirUsuario(Request $request)
    {
        $request->validate([
            'idUsuario' => 'required|integer',
            'idTurnoClase' => 'required|integer',
        ]);

        $inscripcion = $this->inscripcionService->inscribirUsuario(
            $request->input('idUsuario'),
            $request->input('idTurnoClase')
        );

        return response()->json($inscripcion, Response::HTTP_CREATED);
    }

    public function cancelarInscripcion($id_usuario, $id_turno_clase)
    {
        try {
            $this->inscripcionService->cancelarInscripcion($id_usuario, $id_turno_clase);
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Inscripción no encontrada'], Response::HTTP_NOT_FOUND);
        } catch (\LogicException $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getInscripcionesPorTurnoClase($id_turno_clase)
    {
        try {
            $alumnosInscriptos = $this->inscripcionService->getInscripcionesPorTurnoClase($id_turno_clase);
            return response()->json($alumnosInscriptos, Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Turno de clase no encontrado'], Response::HTTP_NOT_FOUND);
        }
    }

    public function cargarAsistencia($id_turno_clase, Request $request)
    {
        $asistencias = $request->all();
        $this->inscripcionService->cargarAsistencias($id_turno_clase, $asistencias);

        return response()->json(['success' => true]);
    }

    public function getInscripcionesPorUsuario($id_usuario)
    {
        try {
            $inscripciones = $this->inscripcionService->getInscripcionesPorUsuario($id_usuario);
            return response()->json($inscripciones, Response::HTTP_OK);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'Usuario no encontrado'], Response::HTTP_NOT_FOUND);
        }
    }
}
