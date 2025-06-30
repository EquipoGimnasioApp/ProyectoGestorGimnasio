<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\UsuarioServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Usuario;

class UsuarioController extends Controller
{
    public function __construct(
        protected UsuarioServiceInterface $usuarioSrv
    ) {
        $this->usuarioSrv = $usuarioSrv;
    }

    public function index()
    {
        $usuarios = Usuario::with('tipoUsuario')->get();
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

    public function getProfesores()
    {
        $profesores = $this->usuarioSrv->getProfesores();
        return response()->json($profesores, Response::HTTP_OK);
    }

    public function getAlumnos()
    {
        $alumnos = $this->usuarioSrv->getAlumnos();
        return response()->json($alumnos, Response::HTTP_OK);
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

    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    }

    public function modificarTipo(Request $request, $id)
    {
        $request->validate([
            'id_tipo_usuario' => 'required|integer|exists:tipo_usuario,id'
        ]);

        $usuario = Usuario::findOrFail($id);
        $usuario->id_tipo_usuario = $request->id_tipo_usuario;
        $usuario->save();

        return response()->json(['message' => 'Tipo de usuario actualizado correctamente']);
    }
}
