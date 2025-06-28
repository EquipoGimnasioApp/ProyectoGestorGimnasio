import { useMemo, useCallback, useEffect, useState } from "react"
import environment from "../../environments/environment"
import Carga from "../carga/Carga"

import SnackbarMensaje from "../utils/SnackbarMensaje"
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Typography,
    TextField,
} from "@mui/material"


export default function AbmUsuarios() {
    const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
    const [usuarios, setUsuarios] = useState([])
    const [cargando, setCargando] = useState(true)

    const [abrirSnackbar, setAbrirSnackbar] = useState(false)
    const [mensajeSnackbar, setMensajeSnackbar] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState("info")

    const showSnackbar = useCallback((mensaje, severidad) => {
        setMensajeSnackbar(mensaje)
        setSnackbarSeverity(severidad)
        setAbrirSnackbar(true)
    }, [])
    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") {
            return
        }

        setAbrirSnackbar(false)
    }

    const getUsuarios = useCallback(
        async (token) => {
            setUsuarios([])
            setCargando(true)

            try {
                const response = await fetch(`${environment.apiUrl}/usuarios`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Error al obtener los usuarios")
                }

                const data = await response.json()
                setUsuarios(data)
            } catch (error) {
                showSnackbar(error.message ?? "Error al obtener los usuarios", "error")
                setUsuarios([])
            } finally {
                setCargando(false)
            }
        },
        [showSnackbar]
    )

    useEffect(() => {
        getUsuarios(userToken)
    }, [userToken, getUsuarios])

    const deleteUsuario = async (usuarioEliminado, token) => {
        setCargando(true)
        try {
            const response = await fetch(`${environment.apiUrl}/usuarios/${usuarioEliminado.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message ?? "Error al eliminar el usuario")
            }

            showSnackbar("Usuario eliminado exitosamente", "success")
            await getUsuarios(token)
        } catch (error) {
            showSnackbar(error.message ?? "Error al eliminar el usuario", "error")
            setCargando(false)
        }
    }

    return (
        <>
            <h2 className="titulo-clases">Administrar usuarios</h2>
            <TableContainer component={Paper} className="equipamiento-table">
                {cargando ? (
                    <Carga />
                ) : (
                    <UsuariosTabla
                        usuarios={usuarios}
                        onEliminar={(usuario) => deleteUsuario(usuario, userToken)}
                    />
                )}
            </TableContainer>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                    variant="outlined"
                    disabled={cargando}
                    className="boton-principal"
                    sx={{ ml: 2 }}
                    onClick={() => getUsuarios(userToken)}
                >
                    Actualizar
                </Button>
            </Box>
            <SnackbarMensaje
                abrirSnackbar={abrirSnackbar}
                duracionSnackbar={5000}
                handleCloseSnackbar={handleCloseSnackbar}
                mensajeSnackbar={mensajeSnackbar}
                snackbarSeverity={snackbarSeverity}
            />
        </>
    )
}

function UsuariosTabla({ usuarios, onEliminar }) {
    const [openEliminar, setOpenEliminar] = useState(false)
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

    const handleClickEliminar = (usuario) => {
        setUsuarioAEliminar(usuario)
        setOpenEliminar(true)
    }

    const handleConfirmarEliminar = () => {
        if (usuarioAEliminar) {
            onEliminar(usuarioAEliminar)
        }
        setOpenEliminar(false)
        setUsuarioAEliminar(null)
    }

    const handleCancelarEliminar = () => {
        setOpenEliminar(false)
        setUsuarioAEliminar(null)
    }

    const encabezadosTabla = () => {
        return (
            <TableHead className="cabecera-tabla-abm">
                <TableRow>
                    <TableCell>USUARIO</TableCell>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>ROL</TableCell>
                    <TableCell>DETALLES</TableCell>
                    <TableCell>ELIMINAR</TableCell>
                </TableRow>
            </TableHead>
        )
    }

    // Ordenar usuarios: 1-ADMINISTRADOR, 3-PROFESOR, 2-ALUMNO
    const ordenRol = { 1: 0, 3: 1, 2: 2 };
    const usuariosOrdenados = [...usuarios].sort(
        (a, b) => (ordenRol[a.id_tipo_usuario] ?? 99) - (ordenRol[b.id_tipo_usuario] ?? 99)
    );

    if (!usuarios || usuarios.length === 0) {
        return (
            <Table sx={{ minWidth: 600 }} aria-label="tabla de abm usuarios">
                {encabezadosTabla()}
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} align="center">
                            No hay usuarios para mostrar
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    function capitalizarNombreCompleto(nombre, apellido) {
  // Une nombre y apellido, separa por espacios, capitaliza cada palabra y vuelve a unir
  return (nombre + " " + apellido)
    .split(" ")
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(" ");
}

    return (
        <>
            <Table sx={{ minWidth: 600 }} aria-label="tabla de abm usuarios">
                {encabezadosTabla()}
                <TableBody>
                    {usuariosOrdenados.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>
                                {capitalizarNombreCompleto(usuario.nombres, usuario.apellidos)}
                            </TableCell>
                            <TableCell>{usuario.email.toLowerCase()}</TableCell>
                            <TableCell>{usuario.tipo_usuario?.tipo.charAt(0).toUpperCase() + usuario.tipo_usuario?.tipo.slice(1).toLowerCase()}</TableCell>
                            <TableCell>
                                <Button variant="outlined" className="boton-principal" /* onClick={() => handleClickEliminar(usuario)} */>
                                    Detalles
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" className="boton-principal" onClick={() => handleClickEliminar(usuario)}>
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal open={openEliminar} onClose={handleCancelarEliminar}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid #000",
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Confirmar eliminación
                    </Typography>
                    <Typography sx={{ mb: 3 }}>¿Está seguro de que desea eliminar el usuario?</Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button variant="outlined" className="boton-secundario" onClick={handleCancelarEliminar}>
                            Cancelar
                        </Button>
                        <Button variant="contained" className="boton-principal" onClick={handleConfirmarEliminar} color="error">
                            Eliminar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

