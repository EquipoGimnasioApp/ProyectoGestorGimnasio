import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import environment from '../../environments/environment';

const AsignarRutina = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [asignando, setAsignando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState(false);

  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), []);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/alumnos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAlumnos(data);
        }
      } catch {
        setAlumnos([]);
      } finally {
        setCargando(false);
      }
    };
    fetchAlumnos();
  }, [token]);

  const handleOpenDialog = alumno => {
    setSelectedAlumno(alumno);
    setDescripcion('');
    setError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAlumno(null);
    setDescripcion('');
    setError('');
  };

  const handleAsignarRutina = async () => {
    if (descripcion.trim() === '' || descripcion.length > 300) {
      setError('La descripción es obligatoria y debe tener hasta 300 caracteres.');
      return;
    }
    setAsignando(true);
    try {
      const getResponse = await fetch(`${environment.apiUrl}/rutina/${selectedAlumno.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      const data = getResponse.ok ? await getResponse.json() : null;
      const url = data && data.descripcion
        ? `${environment.apiUrl}/rutina/update/${selectedAlumno.id}`
        : `${environment.apiUrl}/rutina/create/${selectedAlumno.id}`;
      const method = data && data.descripcion ? 'PUT' : 'POST';
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
      });
      if (response.ok) {
        handleCloseDialog();
        setMensajeExito(true);
      } else {
        setError('No se pudo asignar la rutina.');
      }
    } catch {
      setError('Error al asignar la rutina.');
    } finally {
      setAsignando(false);
    }
  };

  const handleCloseSnackbar = () => {
    setMensajeExito(false);
  };

  return (
    <Box className='p-6 space-y-6' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant='h4' gutterBottom>
        Asignar Rutina a Alumnos
      </Typography>
      <Card>
        <CardContent>
          {cargando ? (
            <Typography>Cargando alumnos...</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Nombre</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Apellido</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1.15rem' }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map(alumno => (
                    <TableRow key={alumno.id}>
                      <TableCell>{alumno.nombres}</TableCell>
                      <TableCell>{alumno.apellidos}</TableCell>
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
        </CardContent>
      </Card>
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
    </Box>
  );
};

export default AsignarRutina;