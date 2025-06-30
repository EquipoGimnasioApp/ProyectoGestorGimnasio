import { useState, useMemo, useCallback, useEffect } from 'react'
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
    Paper
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { es } from 'date-fns/locale'
import UsuarioAcceesToken from '../../models/auth/UsuarioAccessToken'
import environment from '../../environments/environment'
import SnackbarMensaje from '../utils/SnackbarMensaje'
import Carga from '../carga/Carga'

export default function EditarPerfil() {
    const usuario = useMemo(() => new UsuarioAcceesToken(JSON.parse(localStorage.getItem('usuario'))).usuario, [])
    const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
    const [cargando, setCargando] = useState(true)
    const [tiposDocumento, setTiposDocumento] = useState([])
    const [fotoPerfil, setFotoPerfil] = useState(null)
    const [abrirSnackbar, setAbrirSnackbar] = useState(false)
    const [mensajeSnackbar, setMensajeSnackbar] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState('info')

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
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
        telefono: '',
        telefono_emergencia: '',
        id_tipo_documento: '',
        documento_identidad: '',
        cobertura_medica: '',
        observaciones_salud: '',
        direccion: '',
        ciudad: '',
        codigo_postal: '',
        pais: '',
        estado_membresia: '',
    })

    const getTiposDocumento = useCallback(
        async (token) => {
            setTiposDocumento([])
            setCargando(true)
            try {
                const response = await fetch(`${environment.apiUrl}/tipos-documento`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error('Error al obtener los tipos de documento')
                }
                const data = await response.json()
                setTiposDocumento(data)
            } catch (error) {
                showSnackbar(error.message ?? 'Error al obtener los tipos de documento', 'error')
                setTiposDocumento([])
            } finally {
                setCargando(false)
            }
        },
        [showSnackbar]
    )

    const getPerfil = useCallback(
        async (usuario, token) => {
            setCargando(true)
            const idUsuario = usuario.id
            try {
                await getTiposDocumento(token)
                const response = await fetch(`${environment.apiUrl}/perfiles/${idUsuario}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (!response.ok) {
                    throw new Error('Error al obtener el perfil')
                }
                const data = await response.json()
                setForm({
                    fecha_nacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null,
                    telefono: data.telefono || '',
                    telefono_emergencia: data.telefono_emergencia || '',
                    id_tipo_documento: data.id_tipo_documento || '',
                    documento_identidad: data.documento_identidad || '',
                    cobertura_medica: data.cobertura_medica || '',
                    observaciones_salud: data.observaciones_salud || '',
                    direccion: data.direccion || '',
                    ciudad: data.ciudad || '',
                    codigo_postal: data.codigo_postal || '',
                    pais: data.pais
                        ? data.pais.charAt(0).toUpperCase() + data.pais.slice(1).toLowerCase()
                        : 'Argentina',
                    estado_membresia: data.estado_membresia || 'No disponible',
                })
                // Obtener la foto como blob
                const fotoRes = await fetch(`${environment.apiUrl}/perfiles/${idUsuario}/foto`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                if (fotoRes.ok) {
                    const blob = await fotoRes.blob()
                    setFotoPerfil(URL.createObjectURL(blob))
                } else {
                    setFotoPerfil(null)
                }
            } catch (error) {
                showSnackbar(error.message || 'Error al tratar de obtener el perfil', 'error')
            } finally {
                setCargando(false)
            }
        },
        [showSnackbar, getTiposDocumento]
    )

    useEffect(() => {
        getPerfil(usuario, token)
        getTiposDocumento(token)
    }, [getPerfil, usuario, token, getTiposDocumento])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleFotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setFotoPerfil(file)
    }

    const handleFotoUpload = async () => {
        if (!fotoPerfil || !(fotoPerfil instanceof File)) {
            showSnackbar('Selecciona una imagen válida', 'warning')
            return
        }
        const formData = new FormData()
        formData.append('foto', fotoPerfil)
        try {
            const response = await fetch(`${environment.apiUrl}/perfiles/${usuario.id}/foto`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })
            if (!response.ok) {
                throw new Error('Error al subir la foto')
            }
            await response.json()
            showSnackbar('Foto actualizada correctamente', 'success')
            getPerfil(usuario, token)
        } catch (error) {
            showSnackbar(error.message || 'Error al subir la foto', 'error')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setCargando(true)
            const response = await fetch(`${environment.apiUrl}/perfiles/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })
            if (!response.ok) {
                throw new Error('Error al actualizar el perfil')
            }
            showSnackbar('Perfil actualizado correctamente', 'success')
            getPerfil(usuario, token)
        } catch (error) {
            showSnackbar(error.message || 'Error al actualizar el perfil', 'error')
        } finally {
            setCargando(false)
        }
    }

    const [eliminandoFoto, setEliminandoFoto] = useState(false)

    const handleEliminarFoto = async () => {
        setEliminandoFoto(true)
        try {
            const response = await fetch(`${environment.apiUrl}/perfiles/${usuario.id}/foto`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (!response.ok) {
                throw new Error('Error al eliminar la foto')
            }
            setFotoPerfil(null)
            showSnackbar('Foto eliminada correctamente', 'success')
            getPerfil(usuario, token)
        } catch (error) {
            showSnackbar(error.message || 'Error al eliminar la foto', 'error')
        } finally {
            setEliminandoFoto(false)
        }
    }

    const capitalizar = (str) => (str ? str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '')

    return (
        <>
            <div className='p-6 space-y-6' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper
                    elevation={6}
                    sx={{
                        width: '95vw',
                        maxWidth: 1600,
                        margin: '0 auto',
                        padding: { xs: 2, sm: 6, md: 8 },
                        border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
                        backgroundColor: 'rgba(248, 250, 252, 1)',
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(60,60,60,0.18)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <h2 className='titulo-clases'>Editar mi Perfil</h2>
                    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'center' }}>
                                <Avatar
                                    src={
                                        fotoPerfil
                                            ? fotoPerfil instanceof File
                                                ? URL.createObjectURL(fotoPerfil)
                                                : fotoPerfil
                                            : undefined
                                    }
                                    sx={{ width: 150, height: 150, mr: 3 }}
                                />

                                <Box sx={{ display: 'flex', flexDirection: 'column', width: '180px' }}>
                                    <Button
                                        variant='outlined'
                                        color='black'
                                        fullWidth
                                        component='label'
                                        sx={{ mb: 1, width: 200 }}
                                    >
                                        Seleccionar foto
                                        <input
                                            type='file'
                                            accept='image/*'
                                            hidden
                                            onChange={handleFotoChange}
                                        />
                                    </Button>
                                    <Button
                                        variant='contained'
                                        className="boton-principal"
                                        fullWidth
                                        sx={{ mb: 1, width: 200 }}
                                        onClick={handleFotoUpload}
                                    >
                                        Subir foto
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <Typography variant='h4' align='center' mb={2} sx={{ marginBottom: 2, marginTop: 9 }}>
                            {`${capitalizar(usuario.nombres)} ${capitalizar(usuario.apellidos)}`}
                        </Typography>
                        {cargando || !form.estado_membresia || !form.pais ? (
                            <Carga />
                        ) : (
                            <>
                                {/* <Typography
                            variant='subtitle1'
                            align='center'
                            sx={{ mb: 4, color: 'text.secondary', fontWeight: 'bold' }}
                        >
                            Estado de membresía: {form.estado_membresia || 'No disponible'}
                        </Typography> */}
                                <form onSubmit={handleSubmit}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                                        <DatePicker
                                            label='Fecha de nacimiento'
                                            value={form.fecha_nacimiento ?? null}
                                            onChange={newValue => setForm({ ...form, fecha_nacimiento: newValue })}
                                            format='yyyy-MM-dd'
                                            slotProps={{
                                                textField: { fullWidth: true, size: 'medium' },
                                            }}
                                        />
                                    </LocalizationProvider>
                                    <TextField
                                        label='Teléfono'
                                        name='telefono'
                                        value={form.telefono}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <TextField
                                        label='Teléfono de Emergencia'
                                        name='telefono_emergencia'
                                        value={form.telefono_emergencia}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <FormControl fullWidth margin='normal'>
                                        <InputLabel>Tipo de Documento</InputLabel>
                                        <Select
                                            name='id_tipo_documento'
                                            value={form.id_tipo_documento}
                                            label='Tipo de Documento'
                                            onChange={handleChange}
                                        >
                                            {tiposDocumento.map((tipo) => (
                                                <MenuItem key={tipo.id} value={tipo.id}>
                                                    {tipo.descripcion}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        label='Documento de Identidad'
                                        name='documento_identidad'
                                        value={form.documento_identidad}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <TextField
                                        label='Obra Social / Seguro Médico'
                                        name='cobertura_medica'
                                        value={form.cobertura_medica}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <TextField
                                        label='Observaciones sobre Salud'
                                        name='observaciones_salud'
                                        value={form.observaciones_salud}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                        multiline
                                        rows={2}
                                    />
                                    <TextField
                                        label='País/región'
                                        name='pais'
                                        value={form.pais}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                        disabled
                                    />
                                    <TextField
                                        label='Ciudad'
                                        name='ciudad'
                                        value={form.ciudad}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <TextField
                                        label='Dirección'
                                        name='direccion'
                                        value={form.direccion}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <TextField
                                        label='Código postal'
                                        name='codigo_postal'
                                        value={form.codigo_postal}
                                        onChange={handleChange}
                                        fullWidth
                                        margin='normal'
                                    />
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        className='boton-principal'
                                        sx={{ mt: 3, mb: 2 }}
                                        fullWidth
                                    >
                                        Guardar
                                    </Button>
                                </form>
                            </>
                        )}
                    </Box>
                    <SnackbarMensaje
                        abrirSnackbar={abrirSnackbar}
                        duracionSnackbar={5000}
                        handleCloseSnackbar={handleCloseSnackbar}
                        mensajeSnackbar={mensajeSnackbar}
                        snackbarSeverity={snackbarSeverity}
                    />
                </Paper>
            </div>
        </>
    )
}