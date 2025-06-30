import React, { useEffect, useState, useMemo } from 'react'
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material'
import environment from '../../environments/environment'
import CargaTabla from '../clases-carga/CargaTabla'

const AsignarRutina = () => {
  const [alumnos, setAlumnos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAlumno, setSelectedAlumno] = useState(null)
  const [descripcion, setDescripcion] = useState('')
  const [error, setError] = useState('')
  const [asignando, setAsignando] = useState(false)
  const [mensajeExito, setMensajeExito] = useState(false)

  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/alumnos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setAlumnos(data)
        }
      } catch {
        setAlumnos([])
      } finally {
        setCargando(false)
      }
    }
    fetchAlumnos()
  }, [token])

  const handleOpenDialog = alumno => {
    setSelectedAlumno(alumno)
    setDescripcion('')
    setError('')
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedAlumno(null)
    setDescripcion('')
    setError('')
  }

  const handleAsignarRutina = async () => {
    if (descripcion.trim() === '' || descripcion.length > 300) {
      setError('La descripción es obligatoria y debe tener hasta 300 caracteres.')
      return
    }
    setAsignando(true)
    try {
      const getResponse = await fetch(`${environment.apiUrl}/rutina/${selectedAlumno.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = getResponse.ok ? await getResponse.json() : null
      const url = data && data.descripcion
        ? `${environment.apiUrl}/rutina/update/${selectedAlumno.id}`
        : `${environment.apiUrl}/rutina/create/${selectedAlumno.id}`
      const method = data && data.descripcion ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_usuario: selectedAlumno.id,
          descripcion
        })
      })
      if (response.ok) {
        handleCloseDialog()
        setMensajeExito(true)
      } else {
        setError('No se pudo asignar la rutina.')
      }
    } catch {
      setError('Error al asignar la rutina.')
    } finally {
      setAsignando(false)
    }
  }

  const handleCloseSnackbar = () => {
    setMensajeExito(false)
  }

  function capitalizarNombreCompleto(nombre, apellido) {
    return (nombre + ' ' + apellido)
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')
  }

  return (
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
        <h2 className="titulo-clases">Asignar Rutina</h2>

        {cargando ? (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
            <CargaTabla texto='Cargando alumnos...' />
          </Box>
        ) : (
          <TableContainer component={Paper} className="equipamiento-table">
            <Table>
              <TableHead className="cabecera-tabla-abm">
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>ALUMNO</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>EMAIL</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>ACCIÓN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnos.map(alumno => (
                  <TableRow key={alumno.id}>
                    <TableCell>{capitalizarNombreCompleto(alumno.nombres, alumno.apellidos)}</TableCell>
                    <TableCell>{alumno.email}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        sx={{ backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#222' } }}
                        onClick={() => handleOpenDialog(alumno)}
                      >
                        Asignar Rutina
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Asignar Rutina a {selectedAlumno && `${selectedAlumno.nombres} ${selectedAlumno.apellidos}`}</DialogTitle>
          <DialogContent>
            <TextField
              label='Descripción de la rutina'
              multiline
              rows={5}
              fullWidth
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              inputProps={{ maxLength: 300 }}
              helperText={`${descripcion.length}/300`}
              error={!!error}
            />
            {error && (
              <Typography color='error' variant='body2'>
                {error}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button
              variant='contained'
              onClick={handleAsignarRutina}
              disabled={asignando}
              sx={{ backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#222' } }}
            >
              {asignando ? 'Cargando...' : 'Asignar'}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={mensajeExito}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity='success' sx={{ width: '100%' }}>
            ¡Rutina asignada correctamente!
          </Alert>
        </Snackbar>

      </Paper>
    </div>
  )
}

export default AsignarRutina