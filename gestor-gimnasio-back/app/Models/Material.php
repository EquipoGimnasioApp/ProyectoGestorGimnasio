<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    protected $table = 'equipamiento';

    protected $primaryKey = 'id';

    public $timestamps = false;

    protected $fillable = [
        'descripcion',
        'stock',
    ];

    protected $casts = [
        'descripcion' => 'string',
        'stock' => 'integer',
    ];
}
