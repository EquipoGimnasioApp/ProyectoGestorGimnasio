<?php

namespace App\Http\Repositories;

use App\Models\TipoDocumento;

class TipoDocumentoRepository
{
    public function getAll()
    {
        return TipoDocumento::all();
    }
}
