import { useMemo, useCallback, useEffect, useState } from 'react'
import environment from '../../environments/environment'
import Carga from '../carga/Carga'
import SnackbarMensaje from '../utils/SnackbarMensaje'
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
} from '@mui/material'

export default function AbmUsuarios() {
  const userToken = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [filtroNombre, setFiltroNombre] = useState('')
  const [filtroEmail, setFiltroEmail] = useState('')

  const showSnackbar = useCallback((mensaje, severidad) => {
    setMensajeSnackbar(mensaje)
    setSnackbarSeverity(severidad)
    setAbrirSnackbar(true)
  }, [])

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
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
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          throw new Error('Error al obtener los usuarios')
        }
        const data = await response.json()
        setUsuarios(data)
      } catch (error) {
        showSnackbar(error.message ?? 'Error al obtener los usuarios', 'error')
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
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? 'Error al eliminar el usuario')
      }
      showSnackbar('Usuario eliminado exitosamente', 'success')
      await getUsuarios(token)
    } catch (error) {
      showSnackbar(error.message ?? 'Error al eliminar el usuario', 'error')
      setCargando(false)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            width: '95vw',
            maxWidth: 1700,
            margin: '0 auto',
            padding: { xs: 2, sm: 6, md: 8 },
            border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
            backgroundColor: 'rgba(248, 250, 252, 1)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(60,60,60,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2 className='titulo-clases'>Administrar Usuarios</h2>
          <Box sx={{ width: '100%', display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label='Buscar por nombre'
              variant='outlined'
              size='small'
              value={filtroNombre}
              onChange={e => setFiltroNombre(e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label='Buscar por email'
              variant='outlined'
              size='small'
              value={filtroEmail}
              onChange={e => setFiltroEmail(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>
          <TableContainer component={Paper} className='equipamiento-table'>
            {cargando ? (
              <Carga />
            ) : (
              <UsuariosTabla
                usuarios={usuarios}
                filtroNombre={filtroNombre}
                filtroEmail={filtroEmail}
                onEliminar={usuario => deleteUsuario(usuario, userToken)}
              />
            )}
          </TableContainer>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant='outlined'
              disabled={cargando}
              className='boton-principal'
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
        </Paper>
      </div>
    </>
  )
}

function UsuariosTabla({ usuarios, filtroNombre = '', filtroEmail = '', onEliminar }) {
  const [openEliminar, setOpenEliminar] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)
  const [openModificar, setOpenModificar] = useState(false)
  const [usuarioAModificar, setUsuarioAModificar] = useState(null)
  const [nuevoTipoUsuario, setNuevoTipoUsuario] = useState('')
  const [cargandoModificar, setCargandoModificar] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, mensaje: '', severidad: 'info' })

  const handleClickEliminar = usuario => {
    setUsuarioAEliminar(usuario)
    setOpenEliminar(true)
  }

  const handleClickModificar = usuario => {
    setUsuarioAModificar(usuario)
    setNuevoTipoUsuario(usuario.id_tipo_usuario)
    setOpenModificar(true)
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

  const handleCancelarModificar = () => {
    setOpenModificar(false)
    setUsuarioAModificar(null)
  }

  const handleGuardarModificar = async () => {
    if (usuarioAModificar && nuevoTipoUsuario !== usuarioAModificar.id_tipo_usuario) {
      setCargandoModificar(true)
      try {
        const userToken = localStorage.getItem('usuarioAccesToken')
        const response = await fetch(`${environment.apiUrl}/usuarios/${usuarioAModificar.id}/modificar-tipo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({ id_tipo_usuario: nuevoTipoUsuario }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message ?? 'Error al modificar el usuario')
        }
        setOpenModificar(false)
        setUsuarioAModificar(null)
        setSnackbar({ open: true, mensaje: 'Tipo de usuario modificado exitosamente', severidad: 'success' })
      } catch (error) {
        setSnackbar({ open: true, mensaje: error.message ?? 'Error al modificar el usuario', severidad: 'error' })
      } finally {
        setCargandoModificar(false)
      }
    } else {
      setOpenModificar(false)
      setUsuarioAModificar(null)
    }
  }

  const encabezadosTabla = () => {
    return (
      <TableHead className='cabecera-tabla-abm'>
        <TableRow>
          <TableCell>USUARIO</TableCell>
          <TableCell>EMAIL</TableCell>
          <TableCell>ROL</TableCell>
          <TableCell>MODIFICAR ROL</TableCell>
          <TableCell>ELIMINAR</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  const ordenRol = { 1: 0, 3: 1, 2: 2 }
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombres} ${usuario.apellidos}`.toLowerCase()
    const email = usuario.email.toLowerCase()
    const nombreMatch = filtroNombre.trim() === '' || nombreCompleto.includes(filtroNombre.trim().toLowerCase())
    const emailMatch = filtroEmail.trim() === '' || email.includes(filtroEmail.trim().toLowerCase())
    return nombreMatch && emailMatch
  })
  const usuariosOrdenados = [...usuariosFiltrados].sort(
    (a, b) => (ordenRol[a.id_tipo_usuario] ?? 99) - (ordenRol[b.id_tipo_usuario] ?? 99)
  )

  if (!usuariosOrdenados || usuariosOrdenados.length === 0) {
    return (
      <Table sx={{ minWidth: 600 }} aria-label='tabla de abm usuarios'>
        {encabezadosTabla()}
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} align='center'>
              No hay usuarios para mostrar
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  const capitalizarNombreCompleto = (nombre, apellido) => {
    return (nombre + ' ' + apellido)
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <>
      <Table sx={{ minWidth: 600 }} aria-label='tabla de abm usuarios'>
        {encabezadosTabla()}
        <TableBody>
          {usuariosOrdenados.map(usuario => (
            <TableRow key={usuario.id}>
              <TableCell>
                {capitalizarNombreCompleto(usuario.nombres, usuario.apellidos)}
              </TableCell>
              <TableCell>{usuario.email.toLowerCase()}</TableCell>
              <TableCell>{usuario.tipo_usuario?.tipo.charAt(0).toUpperCase() + usuario.tipo_usuario?.tipo.slice(1).toLowerCase()}</TableCell>
              <TableCell>
                <Button variant='outlined' className='boton-principal' onClick={() => handleClickModificar(usuario)}>
                  Modificar
                </Button>
              </TableCell>
              <TableCell>
                <Button variant='outlined' className='boton-principal' onClick={() => handleClickEliminar(usuario)}>
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
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant='h6' sx={{ mb: 2 }}>
            Confirmar eliminación
          </Typography>
          <Typography sx={{ mb: 3 }}>¿Está seguro de que desea eliminar el usuario?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant='outlined' className='boton-secundario' onClick={handleCancelarEliminar}>
              Cancelar
            </Button>
            <Button variant='contained' className='boton-principal' onClick={handleConfirmarEliminar} color='error'>
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openModificar} onClose={handleCancelarModificar}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant='h6' sx={{ mb: 2 }}>
            Modificar rol
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Seleccione el nuevo rol para el usuario:
          </Typography>
          <TextField
            select
            label='Tipo de usuario'
            value={nuevoTipoUsuario}
            onChange={e => setNuevoTipoUsuario(Number(e.target.value))}
            SelectProps={{ native: true }}
            fullWidth
            disabled={cargandoModificar}
          >
            <option value={1}>Administrador</option>
            <option value={3}>Profesor</option>
            <option value={2}>Alumno</option>
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button variant='outlined' className='boton-secundario' onClick={handleCancelarModificar} disabled={cargandoModificar}>
              Cancelar
            </Button>
            <Button variant='contained' className='boton-principal' onClick={handleGuardarModificar} color='primary' disabled={cargandoModificar}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
      <SnackbarMensaje
        abrirSnackbar={snackbar.open}
        duracionSnackbar={4000}
        handleCloseSnackbar={() => setSnackbar({ ...snackbar, open: false })}
        mensajeSnackbar={snackbar.mensaje}
        snackbarSeverity={snackbar.severidad}
      />
    </>
  )
}

