<?php

namespace App\Http\Interfaces;

use Illuminate\Database\Eloquent\Collection;

interface TurnoClaseServiceInterface
{
    /**
     * Obtiene todos los turnos de clase
     * @return App\Models\TurnoClaseDto[]|Collection
     */
    public function getAll();

    /**
     * Obtiene todos los turnos de clase e indica si un usuario específico está inscrito en cada uno.
     *
     * @param int $userId El ID del usuario.
     * @return App\Models\DTOs\TurnoClaseIncriptionStatusDto[]
     */
    public function getAllWithUserInscriptionStatus(int $userId);

    /**
     * Obtiene la cantidad de cupos (capacidad) para un turno de clase específico.
     *
     * @param int $idTurnoClase El ID del turno de clase del cual se quieren obtener los cupos.
     * @return int La cantidad de cupos definidos para el turno de clase.
     */
    public function getCupoMaximoFromTurnoClase(int $idTurnoClase): int;

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

    /**
     * Obtiene todas las clases para un profesor específico.
     *
     * @param int $idProfesor El ID del profesor.
     * @return App\Models\TurnoClaseDto[]|Collection
     */
    public function getClasesPorProfesor(int $idProfesor);
}
