<?php

namespace App\Http\Repositories;

use App\Models\FormaPago;

class FormaPagoRepository
{
    public function getAll()
    {
        return FormaPago::all();
    }
}
