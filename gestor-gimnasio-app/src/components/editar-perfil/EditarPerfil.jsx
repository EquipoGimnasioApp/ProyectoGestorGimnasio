import { useState, useMemo, useCallback, useEffect } from "react"
import {
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import UsuarioAcceesToken from "../../models/auth/UsuarioAccessToken"
import environment from "../../environments/environment"
import SnackbarMensaje from "../utils/SnackbarMensaje"

// data hardcodeada para los select
const tiposDocumento = [
    { value: "DNI", label: "DNI" },
    { value: "Libreta Cívica", label: "Libreta Cívica" },
    { value: "Libreta de Enrolamiento", label: "Libreta de Enrolamiento" },
]

// data hardcodeada para los select de países, debería traer el pais por default de la tabla perfil
const paises = [
    { value: "Argentina", label: "Argentina" },
]

export default function EditarPerfil() {
    const usuario = useMemo(() => new UsuarioAcceesToken(JSON.parse(localStorage.getItem("usuario"))).usuario, [])
    const token = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
    const [isLoading, setIsLoading] = useState(true)

    const [abrirSnackbar, setAbrirSnackbar] = useState(false)
    const [mensajeSnackbar, setMensajeSnackbar] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState("info")

    const handleCloseSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return
        }

        setAbrirSnackbar(false)
    }

    const showSnackbar = useCallback((mensaje, severidad) => {
        setMensajeSnackbar(mensaje)
        setSnackbarSeverity(severidad)
        setAbrirSnackbar(true)
    }, [])


    const [form, setForm] = useState({
        fecha_nacimiento: null,
        telefono: "",
        telefonoEmergencia: "",
        tipoDocumento: "",
        documento: "",
        coberturaMedica: "",
        observaciones: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        pais: "Argentina",
    })

    const getPerfiles = useCallback(
        async (usuario, token) => {
            /*             setClasesParaTabla([]) */
            setIsLoading(true)
            const idUsuario = usuario.id

            try {
                const response = await fetch(`${environment.apiUrl}/perfiles/${idUsuario}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (!response.ok) {
                    throw new Error("Error al obtener los perfiles")
                }

                const data = await response.json()
                console.log("Perfiles obtenidos:", data)
                /*                 setClasesParaTabla(dataDto) */
            } catch (error) {
                showSnackbar(error.message || "Error al tratar de obtener los perfiles", "error")
                /*                 setClasesParaTabla([]) */
            } finally {
                setIsLoading(false)
            }
        },
        [showSnackbar]
    )

    useEffect(() => {
        getPerfiles(usuario, token)
    }, [getPerfiles, usuario, token])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleFoto = (accion) => {
        // Lógica para tomar, subir o eliminar foto
        alert(`Acción de foto: ${accion}`)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Lógica para guardar los datos
        alert("Datos guardados (simulado)")
    }

    return (
        <>
            <h2 className="titulo-clases" > Editar mi Perfil</h2>
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 6 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
                        <Avatar sx={{ width: 150, height: 150, mr: 3 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", width: "180px" }}>
                            <Button variant="outlined" color="black" fullWidth sx={{ mb: 1 }} onClick={() => handleFoto("tomar")}>
                                Tomar una foto
                            </Button>
                            <Button variant="outlined" color="black" fullWidth sx={{ mb: 1 }} onClick={() => handleFoto("subir")}>
                                Subir una foto
                            </Button>
                            <Button variant="outlined" fullWidth color="error" onClick={() => handleFoto("eliminar")}>
                                Eliminar la foto
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="h4" align="center" mb={2} sx={{ marginBottom: 4, marginTop: 9 }}>
                    Mariano Costa
                </Typography>
                <form onSubmit={handleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <DatePicker
                            label="Fecha de nacimiento"
                            value={form.fecha_nacimiento}
                            onChange={(newValue) => {
                                setForm({ ...form, fecha_nacimiento: newValue })
                            }}
                            format="yyyy-MM-dd"
                            slotProps={{
                                textField: { fullWidth: true, size: 'medium' }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Teléfono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Teléfono de Emergencia"
                        name="telefonoEmergencia"
                        value={form.telefonoEmergencia}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de Documento</InputLabel>
                        <Select
                            name="tipoDocumento"
                            value={form.tipoDocumento}
                            label="Tipo de Documento"
                            onChange={handleChange}
                        >
                            {tiposDocumento.map((tipo) => (
                                <MenuItem key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Documento de Identidad"
                        name="documento"
                        value={form.documento}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Obra Social / Seguro Médico"
                        name="coberturaMedica"
                        value={form.coberturaMedica}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Observaciones sobre Salud"
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>País/región</InputLabel>
                        <Select
                            name="pais"
                            value={form.pais}
                            label="País/región"
                            onChange={handleChange}
                        >
                            {paises.map((pais) => (
                                <MenuItem key={pais.value} value={pais.value}>
                                    {pais.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Ciudad"
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Código postal"
                        name="codigoPostal"
                        value={form.codigoPostal}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="boton-principal"
                        sx={{ mt: 3, mb: 2 }}
                        fullWidth

                    >
                        Guardar
                    </Button>
                </form>
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