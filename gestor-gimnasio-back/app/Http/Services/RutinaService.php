<?php

namespace App\Http\Services;

use App\Http\Repositories\RutinaRepository;
use App\Http\Interfaces\RutinaServiceInterface;

class RutinaService implements RutinaServiceInterface
{
    protected $rutinaRepository;

    public function __construct(RutinaRepository $rutinaRepository)
    {
        $this->rutinaRepository = $rutinaRepository;
    }

    public function getByUsuario($idUsuario)
    {
        return $this->rutinaRepository->getByUsuario($idUsuario);
    }

    public function create(array $data)
    {
        return $this->rutinaRepository->create($data);
    }

    public function update($id, array $data)
    {
        return $this->rutinaRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->rutinaRepository->delete($id);
    }
}