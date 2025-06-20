<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MensajeInternoMail extends Mailable
{
    use Queueable, SerializesModels;

    public $asunto;
    public $mensaje;
    public $remitente;
    public $esAlumno;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($asunto, $mensaje, $remitente, $esAlumno = false)
    {
        $this->asunto = $asunto;
        $this->mensaje = $mensaje;
        $this->remitente = $remitente;
        $this->esAlumno = $esAlumno;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->asunto)
            ->view('emails.mensaje_interno')
            ->with([
                'mensaje' => $this->mensaje,
                'remitente' => $this->remitente,
                'esAlumno' => $this->esAlumno,
            ]);
    }
}
