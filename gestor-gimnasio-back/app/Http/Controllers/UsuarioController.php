<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\UsuarioServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UsuarioController extends Controller
{
    public function __construct(
        protected UsuarioServiceInterface $usuarioSrv
    ) {
        $this->usuarioSrv = $usuarioSrv;
    }

    public function index()
    {
        $usuarios = $this->usuarioSrv->getAll();
        return response()->json($usuarios);
    }

    public function show(int $id)
    {
        $usuario = $this->usuarioSrv->getById($id);

        if ($usuario) {
            return response()->json($usuario);
        }

        return response()->json(['message' => 'Usuario con ID ' . $id . ' no encontrado'], 404);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'apellidos' => 'required|string|max:255',
            'nombres' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:usuario,email',
            'password' => 'required|string',
        ]);

        $usuario = $this->usuarioSrv->create($data);
        return response()->json($usuario, Response::HTTP_CREATED);
    }

    public function checkEmailExists(string $email)
    {
        if (empty($email)) {
            return response()->json(['message' => 'El email no puede estar vacío'], Response::HTTP_BAD_REQUEST);
        }

        $existe = $this->usuarioSrv->checkEmailExists($email);

        return response()->json(['existe' => $existe], Response::HTTP_OK);
    }
}
