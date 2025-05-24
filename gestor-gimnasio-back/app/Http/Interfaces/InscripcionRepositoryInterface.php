<?php

namespace App\Http\Interfaces;

interface InscripcionRepositoryInterface
{
    /**
     * Inscribe un usuario en un turno de clase específico.
     *
     * @param int $id_usuario El ID del usuario que se va a inscribir.
     * @param int $id_turno_clase El ID del turno de clase al que se inscribirá el usuario.
     * @return App\Models\Inscripcion La entidad de inscripción creada.
     */
    public function inscribirUsuario($id_usuario, $id_turno_clase);

    /**
     * Cancela una inscripción específica.
     *
     * @param int $id_usuario El ID del usuario que va a cancelar la inscripción.
     * @param int $id_turno_clase El ID del turno de clase al que cancelará la inscripción el usuario.
     * @return int El número de registros eliminados.
     */
    public function cancelarInscripcion($id_usuario, $id_turno_clase);
}
