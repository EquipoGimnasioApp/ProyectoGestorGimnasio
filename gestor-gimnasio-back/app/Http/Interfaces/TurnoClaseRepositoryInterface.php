<?php

namespace App\Http\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface TurnoClaseRepositoryInterface
{
    /**
     * Obtiene todos los turnos de clase
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll(): Collection;

    /**
     * Obtiene todos los turnos de clase e indica si un usuario específico está inscrito en cada uno.
     *
     * @param int $userId El ID del usuario.
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllWithUserInscriptionStatus(int $userId): Collection;

    /**
     * Obtiene la cantidad de cupos (capacidad) para un turno de clase específico.
     *
     * @param int $idTurnoClase El ID del turno de clase del cual se quieren obtener los cupos.
     * @return int La cantidad de cupos definidos para el turno de clase.
     */
    public function getCupoMaximoFromTurnoClase(int $idTurnoClase): int;

    /**
     * Obtiene el cupo actual disponible para un turno de clase específico.
     *
     * @param int $idTurnoClase El ID del turno de clase
     * @return int El número de cupos disponibles actuales
     */
    public function getCupoActual(int $idTurnoClase);

    /**
     * Obtiene los turnos de clases filtrados por fecha y horario.
     *
     * Esta función permite obtener los turnos de clases que se encuentran dentro de un día específico y dentro de un rango horario determinado.
     *
     * @param string $fecha La fecha para filtrar los turnos (formato: YYYY-MM-DD)
     * @param string $horarioDesde El horario de inicio para filtrar los turnos (formato: HH:MM o HH:MM:SS)
     * @param string $horarioHasta El horario de fin para filtrar los turnos (formato: HH:MM o HH:MM:SS)
     * @return int La cantidad de turnos de clase que cumplen con los criterios especificados.
     *
     * @throws \Exception Si ocurre un error durante la consulta a la base de datos
     */
    public function getTurnosByFechaHorario(string $fecha, string $horarioDesde, string $horarioHasta);

    /**
     * Crea un nuevo turno de clase.
     * @param array $turnoClase Los datos del turno de clase a crear.
     * @return mixed
     */
    public function create(array $turnoClase);

    /**
     * Actualiza un turno de clase existente.
     * @param int $idTurnoClase El ID del turno de clase a actualizar.
     * @param array $turnoClase Los nuevos datos del turno de clase.
     * @return mixed
     */
    public function update(int $idTurnoClase, array $turnoClase);

    /**
     * Eliminar una clase existente.
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id);

    public function find(int $idTurnoClase);
}
