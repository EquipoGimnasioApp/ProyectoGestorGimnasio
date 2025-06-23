<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\PerfilServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Perfil;


class PerfilController extends Controller
{
    public function __construct(
        protected PerfilServiceInterface $perfilSrv
    ) {
        $this->perfilSrv = $perfilSrv;
    }


    public function show(int $id)
    {
        $perfil = $this->perfilSrv->getByUserId($id);

        if ($perfil) {
            return response()->json($perfil);
        }
        return response()->json(['message' => 'Perfil con ID ' . $id . ' no encontrado'], 404);
    }

    public function update(int $userId, Request $request)
    {
        Log::info('PerfilController@update: Recibida petición de actualización', ['userId' => $userId, 'request' => $request->all()]);
        $data = $request->validate([
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => 'nullable|string|max:50',
            'telefono_emergencia' => 'nullable|string|max:50',
            'id_tipo_documento' => 'nullable|integer|exists:tipo_documento,id',
            'documento_identidad' => 'nullable|string|max:50',
            'cobertura_medica' => 'nullable|string|max:100',
            'observaciones_salud' => 'nullable|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => 'nullable|string|max:100',
            'codigo_postal' => 'nullable|string|max:20',
            'pais' => 'nullable|string|max:100',
        ]);

        $perfil = $this->perfilSrv->update($userId, $data);

        if (!$perfil) {
            Log::warning('PerfilController@update: Perfil no encontrado', ['userId' => $userId]);
            return response()->json(['message' => 'Perfil con ID ' . $userId . ' no encontrado'], 404);
        }

        Log::info('PerfilController@update: Perfil actualizado correctamente', ['perfil' => $perfil]);
        return response()->json($perfil, Response::HTTP_OK);
    }

    public function subirImagen(int $userId, Request $request)
    {

        $perfil = Perfil::where('id_usuario', $userId)->first();

        if (!$perfil) {
            return response()->json(['message' => 'Perfil no encontrado'], 404);
        }

        // Validar que venga una imagen
        $request->validate([
            'imagen' => 'required|image|max:2048', // Máx 2MB
        ]);

        // Si ya tenía una imagen previa, la eliminamos
        if ($perfil->imagen && Storage::exists("public/imagenes/{$perfil->imagen}")) {
            Storage::delete("public/imagenes/{$perfil->imagen}");
        }

        // Guardamos la nueva imagen
        $path = $request->file('imagen')->store('imagenes', 'public');
        $nombreArchivo = basename($path);

        Log::info('Ruta de imagen guardada', ['path' => $path]);


        // Actualizamos el perfil
        $perfil->imagen = $nombreArchivo;
        $perfil->save();

        return response()->json([
            'message' => 'Imagen actualizada correctamente',
            'imagen' => $nombreArchivo,
        ], 200);
    }


    public function eliminarImagen(int $userId)
    {
        $perfil = Perfil::where('id_usuario', $userId)->first();

        if (!$perfil || !$perfil->imagen) {
            return response()->json(['message' => 'No hay imagen para eliminar'], 404);
        }

        // Elimina el archivo físico si existe
        if (Storage::exists("public/imagenes/{$perfil->imagen}")) {
            Log::info('Eliminando archivo', ['archivo' => $perfil->imagen]);
            Storage::delete("public/imagenes/{$perfil->imagen}");
            Log::info('Archivo eliminado', ['archivo' => $perfil->imagen]);
        }

        // Borra la referencia en la base de datos
        $perfil->imagen = null;
        $perfil->save();

        return response()->json(['message' => 'Imagen eliminada correctamente'], 200);
    }
}
