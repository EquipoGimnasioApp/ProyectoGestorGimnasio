<?php

namespace App\Models\DTOs;

class PerfilDto
{
    public ?int $id;
    public ?string $imagen;
    public ?string $fecha_nacimiento;
    public ?string $telefono;
    public ?string $telefono_emergencia;
    public ?string $documento_identidad;
    public ?string $cobertura_medica;
    public ?string $observaciones_salud;
    public ?string $pais;
    public ?string $ciudad;
    public ?string $direccion;
    public ?string $codigo_postal;
    public ?int $id_usuario;
    public ?string $estado_membresia;
    public ?int $id_tipo_documento;

    public function __construct(array $data = [])
    {
        $this->id = $data['id'] ?? null;
        $this->imagen = $data['imagen'] ?? null;
        $this->fecha_nacimiento = $data['fecha_nacimiento'] ?? null;
        $this->telefono = $data['telefono'] ?? null;
        $this->telefono_emergencia = $data['telefono_emergencia'] ?? null;
        $this->documento_identidad = $data['documento_identidad'] ?? null;
        $this->cobertura_medica = $data['cobertura_medica'] ?? null;
        $this->observaciones_salud = $data['observaciones_salud'] ?? null;
        $this->pais = $data['pais'] ?? null;
        $this->ciudad = $data['ciudad'] ?? null;
        $this->direccion = $data['direccion'] ?? null;
        $this->codigo_postal = $data['codigo_postal'] ?? null;
        $this->id_usuario = $data['id_usuario'] ?? null;
        $this->estado_membresia = $data['estado_membresia'] ?? null;
        $this->id_tipo_documento = $data['id_tipo_documento'] ?? null;
    }
}
