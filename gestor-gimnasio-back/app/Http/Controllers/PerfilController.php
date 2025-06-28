<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\PerfilServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use App\Models\Perfil;

define('NULLABLE_STRING_MAX_50', 'nullable|string|max:50');
define('NULLABLE_STRING_MAX_100', 'nullable|string|max:100');


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
            $array = $perfil->toArray();
            unset($array['foto']);
            return response()->json($array);
        }
        return response()->json(['message' => 'Perfil con ID ' . $id . ' no encontrado'], 404);
    }

    public function update(int $userId, Request $request)
    {
        Log::info('PerfilController@update: Recibida petición de actualización', ['userId' => $userId, 'request' => $request->all()]);
        $data = $request->validate([
            'fecha_nacimiento' => 'nullable|date',
            'telefono' => NULLABLE_STRING_MAX_50,
            'telefono_emergencia' => NULLABLE_STRING_MAX_50,
            'id_tipo_documento' => 'nullable|integer|exists:tipo_documento,id',
            'documento_identidad' => NULLABLE_STRING_MAX_50,
            'cobertura_medica' => NULLABLE_STRING_MAX_100,
            'observaciones_salud' => 'nullable|string|max:255',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => NULLABLE_STRING_MAX_100,
            'codigo_postal' => 'nullable|string|max:20',
            'pais' => NULLABLE_STRING_MAX_100,
        ]);

        $perfil = $this->perfilSrv->update($userId, $data);

        if (!$perfil) {
            Log::warning('PerfilController@update: Perfil no encontrado', ['userId' => $userId]);
            return response()->json(['message' => 'Perfil con ID ' . $userId . ' no encontrado'], 404);
        }

        Log::info('PerfilController@update: Perfil actualizado correctamente', ['perfil' => $perfil]);
        $array = $perfil->toArray();
        unset($array['foto']);
        return response()->json($array, Response::HTTP_OK);
    }

    public function subirFoto(int $userId, Request $request)
    {
        $perfil = Perfil::where('id_usuario', $userId)->first();
        if (!$perfil) {
            return response()->json(['message' => 'Perfil no encontrado'], 404);
        }
        $request->validate([
            'foto' => 'required|image|max:2048',
        ]);
        $fotoBinaria = file_get_contents($request->file('foto')->getRealPath());
        $perfil->foto = $fotoBinaria;
        $perfil->save();
        return response()->json(['message' => 'Foto actualizada correctamente'], 200);
    }

    public function obtenerFoto(int $userId)
    {
        $perfil = Perfil::where('id_usuario', $userId)->first();
        if (!$perfil || !$perfil->foto) {
            return response()->json(['message' => 'Foto no encontrada'], 404);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_buffer($finfo, $perfil->foto);
        finfo_close($finfo);
        return response($perfil->foto, 200)->header('Content-Type', $mime);
    }
}
