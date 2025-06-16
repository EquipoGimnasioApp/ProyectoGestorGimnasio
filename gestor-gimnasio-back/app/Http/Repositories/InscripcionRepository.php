<?php

namespace App\Http\Repositories;

use App\Http\Interfaces\InscripcionRepositoryInterface;
use App\Models\Inscripcion;

class InscripcionRepository implements InscripcionRepositoryInterface
{
    public function inscribirUsuario($id_usuario, $id_turno_clase)
    {
        return Inscripcion::create([
            'id_usuario' => $id_usuario,
            'id_turno_clase' => $id_turno_clase,
            'fecha' => now(),
        ]);
    }

    public function cancelarInscripcion($id_usuario, $id_turno_clase)
    {
        return Inscripcion::where('id_usuario', $id_usuario)
            ->where('id_turno_clase', $id_turno_clase)
            ->delete();
    }

    public function getInscripcionesPorTurnoClase($id_turno_clase)
    {
        return Inscripcion::where('id_turno_clase', $id_turno_clase)
            ->with('usuario')
            ->get();
    }

    public function cargarAsistencias($idTurnoClase, array $asistencias)
    {
        foreach ($asistencias as $asistencia) {
            Inscripcion::where('id_turno_clase', $idTurnoClase)
                ->where('id_usuario', $asistencia['idAlumno'])
                ->update(['presente' => $asistencia['presente']]);
        }
    }
}
