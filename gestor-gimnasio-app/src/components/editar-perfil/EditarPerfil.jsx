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

    // Estado con nombres iguales a la base de datos
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
                setFotoPerfil(data.imagen ? `${environment.apiUrl}/storage/${data.imagen}` : null)
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
        if (file) {
            setFotoPerfil(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setCargando(true)
            /* const formData = new FormData()
            formData.append('fecha_nacimiento', form.fecha_nacimiento instanceof Date ? form.fecha_nacimiento.toISOString().split('T')[0] : form.fecha_nacimiento)
            formData.append('telefono', form.telefono)
            formData.append('telefono_emergencia', form.telefono_emergencia)
            formData.append('id_tipo_documento', form.id_tipo_documento)
            formData.append('documento_identidad', form.documento_identidad)
            formData.append('cobertura_medica', form.cobertura_medica)
            formData.append('observaciones_salud', form.observaciones_salud)
            formData.append('direccion', form.direccion)
            formData.append('ciudad', form.ciudad)
            formData.append('codigo_postal', form.codigo_postal)
            formData.append('pais', form.pais)
            if (fotoPerfil && fotoPerfil instanceof File) {
                formData.append('imagen', fotoPerfil)
            } */
            const response = await fetch(`${environment.apiUrl}/perfiles/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form)
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

    const capitalizar = (str) => (str ? str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : '')

    return (
        <>
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
                                sx={{ mb: 1 }}
                            >
                                Subir una foto
                                <input
                                    type='file'
                                    accept='image/*'
                                    hidden
                                    onChange={handleFotoChange}
                                />
                            </Button>
                            <Button
                                variant='outlined'
                                fullWidth
                                color='error'
                                onClick={() => setFotoPerfil(null)}
                            >
                                Eliminar la foto
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
                        <Typography
                            variant='subtitle1'
                            align='center'
                            sx={{ mb: 4, color: 'text.secondary', fontWeight: 'bold' }}
                        >
                            Estado de membresía: {form.estado_membresia || 'No disponible'}
                        </Typography>
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
        </>
    )
}