<?php

namespace App\Http\Repositories;

use App\Http\Interfaces\TurnoClaseRepositoryInterface;
use App\Models\TurnoClase;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TurnoClaseRepository implements TurnoClaseRepositoryInterface
{
    public function getAll(): Collection
    {
        return TurnoClase::with(['tipoActividad', 'profesor','sala'])
            ->orderBy('id', 'DESC')
            ->get();
    }

    public function getAllWithUserInscriptionStatus(int $userId): Collection
    {
        return TurnoClase::query()
            ->select([
                'turno_clase.id AS idTurnoClase',
                'turno_clase.id_actividad AS idActividad',
                DB::raw('CONCAT(
                    LEFT(tipo_actividad.tipo, 1),
                    SUBSTRING(LOWER(tipo_actividad.tipo), 2)
                ) AS tipoActividad'),
                'turno_clase.id_profesor AS idProfesor',
                'usuario.nombres AS nombresProfesor',
                'usuario.apellidos AS apellidosProfesor',
                'turno_clase.id_sala AS idSala',
                'sala.descripcion AS descripcionSala',
                'turno_clase.fecha',
                'turno_clase.horario_desde AS horarioDesde',
                'turno_clase.horario_hasta AS horarioHasta',
                'turno_clase.cupo_maximo AS cupoMaximo',
                DB::raw('(
                    SELECT COUNT(*)
                    FROM inscripcion
                    WHERE id_turno_clase = turno_clase.id
                ) AS totalInscriptos'),
                DB::raw('CASE WHEN inscripcion.id IS NOT NULL THEN TRUE ELSE FALSE END AS inscripto')
            ])
            ->leftJoin('tipo_actividad', 'turno_clase.id_actividad', '=', 'tipo_actividad.id')
             ->leftJoin('sala', 'turno_clase.id_sala', '=', 'sala.id')
            ->leftJoin('inscripcion', function ($join) use ($userId) {
                $join->on('turno_clase.id', '=', 'inscripcion.id_turno_clase')
                    ->where('inscripcion.id_usuario', '=', $userId);
            })
            ->join('usuario', 'turno_clase.id_profesor', '=', 'usuario.id')
            ->where(function ($query) {
                $query->whereDate('turno_clase.fecha', '>', now()->toDateString())
                    ->orWhere(function ($subQuery) {
                        $subQuery->whereDate('turno_clase.fecha', '=', now()->toDateString())
                            ->whereTime('turno_clase.horario_desde', '>', now()->toTimeString());
                    });
            })
            ->orderBy('turno_clase.fecha', 'DESC')
            ->orderBy('turno_clase.id_actividad')
            ->orderBy('turno_clase.horario_desde')
            ->orderBy('turno_clase.horario_hasta')
            ->get();
    }

    public function getCupoMaximoFromTurnoClase(int $idTurnoClase): int
    {
        return TurnoClase::query()
            ->select('cupo_maximo')
            ->where('id', $idTurnoClase)
            ->value('cupo_maximo');
    }

    public function getCupoActual(int $idTurnoClase)
    {
        return TurnoClase::query()
            ->select(DB::raw('cupo_maximo - COUNT(inscripcion.id) AS cupoActual'))
            ->leftJoin('inscripcion', 'turno_clase.id', '=', 'inscripcion.id_turno_clase')
            ->where('turno_clase.id', $idTurnoClase)
            ->groupBy('turno_clase.cupo_maximo')
            ->value('cupoActual');
    }

    public function getTurnosByFechaHorario(string $fecha, string $horarioDesde, string $horarioHasta)
    {
        return TurnoClase::query()
            ->whereDate('fecha', $fecha)
            ->whereTime('horario_desde', '>=', $horarioDesde)
            ->whereTime('horario_hasta', '<=', $horarioHasta)
            ->count();
    }

    public function create(array $turnoClase)
    {
        return TurnoClase::create($turnoClase);
    }

    public function update(int $id, array $turnoClase)
    {
        return TurnoClase::where('id', $id)->update($turnoClase);
    }

    /**
     * Eliminar una clase existente.
     *
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        $turnoClase = TurnoClase::findOrFail($id);
        return $turnoClase->delete();
    }

    public function find(int $idTurnoClase)
    {
        return TurnoClase::findOrFail($idTurnoClase);
    }
}
