<?php

namespace App\Http\Interfaces;

interface PerfilServiceInterface
{

    public function getByUserId(int $id);

    public function createForUser(int $userId);

    /*   public function updateForUser(int $userId, array $data); */
}
