import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import environment from '../../environments/environment';

const AsignarRutina = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const token = localStorage.getItem('usuarioAccesToken');
        const response = await fetch(`${environment.apiUrl}/usuarios/alumnos`, {
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
  }, []);

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
    try {
      const token = localStorage.getItem('usuarioAccesToken');
      const response = await fetch(`${environment.apiUrl}/rutina`, {
        method: 'POST',
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
      } else {
        setError('No se pudo asignar la rutina.');
      }
    } catch {
      setError('Error al asignar la rutina.');
    }
  };

  return (
    <Box className='p-6 space-y-6'>
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
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alumnos.map(alumno => (
                    <TableRow key={alumno.id}>
                      <TableCell>{alumno.nombres}</TableCell>
                      <TableCell>{alumno.apellidos}</TableCell>
                      <TableCell>{alumno.email}</TableCell>
                      <TableCell>
                        <Button variant='contained' onClick={() => handleOpenDialog(alumno)}>
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
          <Button variant='contained' onClick={handleAsignarRutina}>Asignar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AsignarRutina;