<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactoLandingMail;
use App\Mail\ContactoMail;

Route::post('/contactoLanding', function (\Illuminate\Http\Request $request) {
    $datos = $request->all(); // o seleccioná solo los campos que quieras
    Mail::to('fitmanagersrl@gmail.com')->send(new ContactoLandingMail($datos));
    return 'Mail enviado';
});

Route::post('/contactos', function (\Illuminate\Http\Request $request) {
    $datos = $request->all(); // o seleccioná solo los campos que quieras
    Mail::to('fitmanagersrl@gmail.com')->send(new ContactoMail($datos));
    return 'Mail enviado';
});
