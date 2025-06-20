<?php

namespace App\Http\Controllers;

use App\Models\Mensaje;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\MensajeInternoMail;

class MensajeController extends Controller
{
    // Enviar mensaje
    public function enviar(Request $request)
    {
        $mensaje = Mensaje::create([
            'remitente_id' => $request->remitente_id,
            'destinatario_id' => $request->destinatario_id,
            'asunto' => $request->asunto,
            'mensaje' => $request->mensaje,
        ]);

        // Obtener datos del destinatario y remitente
        $destinatario = Usuario::find($request->destinatario_id);
        $remitente = Usuario::find($request->remitente_id);
        $nombreRemitente = 'Usuario';
        if ($remitente) {
            // Si es administrador (id_tipo_usuario = 1), mostrar "Administración"
            $nombreRemitente = ($remitente->id_tipo_usuario == 1) ? 'Administración' : ($remitente->nombres . ' ' . $remitente->apellidos);
        }
        // Considerar alumno (3) o profesor (2)
        $esAlumnoOProfe = $destinatario && ($destinatario->id_tipo_usuario == 3 || $destinatario->id_tipo_usuario == 2);
        if ($destinatario && $destinatario->email) {
            Mail::to($destinatario->email)->send(
                new \App\Mail\MensajeInternoMail($request->asunto, $request->mensaje, $nombreRemitente, $esAlumnoOProfe)
            );
        }

        return response()->json(['ok' => true, 'mensaje' => $mensaje]);
    }

    // Listar recibidos
    public function recibidos($usuarioId)
    {
        $mensajes = Mensaje::where('destinatario_id', $usuarioId)
            ->orderBy('fecha_envio', 'desc')
            ->get();
        return response()->json($mensajes);
    }

    // Listar enviados
    public function enviados($usuarioId)
    {
        $mensajes = Mensaje::where('remitente_id', $usuarioId)
            ->orderBy('fecha_envio', 'desc')
            ->get();
        return response()->json($mensajes);
    }

    public function marcarLeido($id)
    {
        $mensaje = Mensaje::findOrFail($id);
        $mensaje->leido = true;
        $mensaje->save();
        return response()->json(['ok' => true]);
    }

    public function eliminar($id)
    {
        $mensaje = Mensaje::findOrFail($id);
        $mensaje->delete();
        return response()->json(['ok' => true]);
    }
}
