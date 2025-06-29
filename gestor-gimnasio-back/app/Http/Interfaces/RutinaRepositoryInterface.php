<?php

namespace App\Http\Interfaces;

interface RutinaRepositoryInterface
{
    public function getByUsuario($idUsuario);
    public function create(array $data);
    public function update($idUsuario, array $data);
    public function delete($id);
}