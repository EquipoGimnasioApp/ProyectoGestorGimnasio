<?php

namespace App\Http\Services;

use App\Http\Interfaces\ContactoServiceInterface;
use App\Http\Interfaces\ContactoRepositoryInterface;
use App\Models\Contacto;
use Illuminate\Support\Facades\Log;
use App\Mail\ContactoMail;
use Illuminate\Support\Facades\Mail;

class ContactoService implements ContactoServiceInterface
{
    public function __construct(
        private readonly ContactoRepositoryInterface $contacto_repository,
    ) {}

    /**
     * Crea un nuevo contacto en la base de datos.
     *
     * @param array $data
     * @return Contacto
     */
    public function create(array $data)
    {
        $contacto = $this->contacto_repository->create($data);
        $this->enviarEmailNotificacionAdmin($data);
        return $contacto;
    }

    /**
     * Envia un email de notificación al administrador del gimnasio
     *
     * @param Contacto $contacto
     * @return void
     */
    private function enviarEmailNotificacionAdmin(array $data)
    {
        try {
            Mail::to('fitmanagersrl@gmail.com')->send(new ContactoMail($data));
            Log::info("Email de contacto enviado para contacto: {$data['email']}");
        } catch (\Exception $e) {
            Log::error("Error enviando email de contacto: " . $e->getMessage());
        }
    }
}
