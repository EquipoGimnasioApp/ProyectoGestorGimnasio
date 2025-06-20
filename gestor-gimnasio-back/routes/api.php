<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\ContactoLandingController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\SalaController;
use App\Http\Controllers\TipoActividadController;
use App\Http\Controllers\TurnoClaseController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\MaterialController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\MensajeController;

if (!defined('AUTH_SANCTION')) {
    define('AUTH_SANCTION', 'auth:sanctum');
}

if (!defined('ID_ROUTE_PARAMETER')) {
    define('ID_ROUTE_PARAMETER', '/{id}');
}

Route::get('/pagos/{id}', [PagoController::class, 'historial']);

Route::post('auth/login', [AuthController::class, 'login'])
    ->name('login');
Route::prefix('usuarios')->group(function () {
    Route::post('/', [UsuarioController::class, 'store'])
        ->name('usuarios.store');
});

Route::prefix('contactos')->group(function () {
    Route::post('/', [ContactoController::class, 'create'])
        ->name('contactos.create');
});


Route::post('/contactos', [ContactoController::class, 'enviar']);

Route::post('/contactoslanding', [ContactoLandingController::class, 'enviar']);

Route::middleware(AUTH_SANCTION)->group(function () {
    Route::prefix('usuarios')->group(function () {
        Route::get('/check-email/{email}', [UsuarioController::class, 'checkEmailExists'])
            ->middleware('throttle:5,1')
            ->name('usuarios.checkEmail');

        Route::get('/', [UsuarioController::class, 'index'])
            ->name('usuarios.index');

        Route::get('/profesores', [UsuarioController::class, 'getProfesores'])
            ->name('usuarios.getProfesores');

        Route::get('/alumnos', [UsuarioController::class, 'getAlumnos'])
            ->name('usuarios.getAlumnos');

        Route::get(ID_ROUTE_PARAMETER, [UsuarioController::class, 'show'])
            ->name('usuarios.show');
    });

    Route::prefix('turnos-clase')->group(function () {
        Route::get('/', [TurnoClaseController::class, 'getAll'])
            ->name('turnos-clase.index');

        Route::put(ID_ROUTE_PARAMETER, [TurnoClaseController::class, 'update'])
            ->name('turnos-clase.update');

        Route::get('/user-inscription-status/{userId}', [TurnoClaseController::class, 'getAllWithUserInscriptionStatus'])
            ->name('turnos-clase.user-inscription-status');

        Route::get('/cupo-maximo/{idTurnoClase}', [TurnoClaseController::class, 'getCupoMaximoFromTurnoClase'])
            ->name('turnos-clase.cupo-maximo');

        Route::post('/', [TurnoClaseController::class, 'create'])
            ->name('turnos-clase.create');
        Route::delete(ID_ROUTE_PARAMETER, [TurnoClaseController::class, 'destroy'])
            ->name('turnos-clase.destroy');
    });

    Route::prefix('inscripciones')->group(function () {
        Route::post('/', [InscripcionController::class, 'inscribirUsuario'])
            ->name('inscripciones.inscribir-usuario');
        Route::delete('/{id_usuario}/{id_turno_clase}', [InscripcionController::class, 'cancelarInscripcion'])
            ->name('inscripciones.cancelar-inscripcion');
        Route::get('/turnos-clase/{claseId}', [InscripcionController::class, 'getInscripcionesPorTurnoClase'])
            ->name('inscripciones.inscripciones-por-turno-clase');
        Route::post('/cargar-asistencia/{id_turno_clase}', [InscripcionController::class, 'cargarAsistencia'])
            ->name('inscripciones.cargar-asistencia');
    });

    Route::prefix('tipos-actividad')->group(function () {
        Route::get('/', [TipoActividadController::class, 'index'])
            ->name('tipos-actividad.index');
        Route::put(ID_ROUTE_PARAMETER, [TipoActividadController::class, 'update'])
            ->name('tipos-actividad.update');
        Route::post('/', [TipoActividadController::class, 'create'])
            ->name('tipos-actividad.create');
        Route::delete(ID_ROUTE_PARAMETER, [TipoActividadController::class, 'destroy'])
            ->name('tipos-actividad.destroy');
    });

    Route::prefix('salas')->group(function () {
        Route::get('/', [SalaController::class, 'index'])
            ->name('salas.index');
        Route::put(ID_ROUTE_PARAMETER, [SalaController::class, 'update'])
            ->name('salas.update');
        Route::post('/', [SalaController::class, 'create'])
            ->name('salas.create');
        Route::delete(ID_ROUTE_PARAMETER, [SalaController::class, 'destroy'])
            ->name('salas.destroy');
    });

    Route::prefix('equipamiento')->group(function () {
        Route::get('/', [MaterialController::class, 'index'])
            ->name('equipamiento.index');
        Route::post('/', [MaterialController::class, 'create'])
            ->name('equipamiento.create');
        Route::put(ID_ROUTE_PARAMETER, [MaterialController::class, 'update'])
            ->name('equipamiento.update');
        Route::delete(ID_ROUTE_PARAMETER, [MaterialController::class, 'destroy'])
            ->name('equipamiento.destroy');
    });

    Route::post('/mensajes/enviar', [MensajeController::class, 'enviar']);
    Route::get('/mensajes/recibidos/{usuarioId}', [MensajeController::class, 'recibidos']);
    Route::get('/mensajes/enviados/{usuarioId}', [MensajeController::class, 'enviados']);
    Route::patch('/mensajes/{id}/leido', [MensajeController::class, 'marcarLeido']);
    Route::delete('/mensajes/{id}', [MensajeController::class, 'eliminar'])->name('mensajes.destroy');
});
