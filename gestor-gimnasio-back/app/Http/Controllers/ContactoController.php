<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\ContactoServiceInterface;
use Illuminate\Http\Request;
use App\Mail\ContactoMail;
use Illuminate\Support\Facades\Mail;

class ContactoController extends Controller
{
    public function __construct(
        private readonly ContactoServiceInterface $contacto_service,
    ) {}

    public function enviar(Request $request)
    {
        $datos = $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'rol' => 'string',
            'asunto' => 'required|string|max:255',
            'mensaje' => 'required|string',
        ]);

        // Guardar en la base de datos
        $contacto = $this->contacto_service->create($datos);

        // Enviar el mail
        Mail::to('fitmanagersrl@gmail.com')->send(new ContactoMail($datos));

        return response()->json(['message' => 'Consulta enviada correctamente.', 'contacto' => $contacto], 201);
    }
}
