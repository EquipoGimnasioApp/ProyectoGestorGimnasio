import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { EventNote } from '@mui/icons-material';
import environment from '../../environments/environment';
import dayjs from 'dayjs';
import { Box } from '@mui/system';



const MiRutina = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [rutinas, setRutinas] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/rutina/${usuario.id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (!data || !data.descripcion || data.descripcion === '') {
            setRutinas('No tienes una rutina asignada');
          } else {
            setRutinas(data.descripcion);
          }
          setCargando(false);
        } else {
          setRutinas("No tienes una rutina asignada");
          setCargando(false);
        }
      } catch {
        setRutinas("Error al cargar la rutina");
        setCargando(false);
      } 
    };

    fetchRutina();
  }, []);

  return (
    <Box className='p-6 space-y-6'>
      <Typography variant='h4' gutterBottom>
        🏋️‍♂️ Mi Rutina de Gimnasio
      </Typography>
      <Typography variant='body1' marginBottom={2}>
        Esta es tu rutina semanal. ¡Dale con todo!
      </Typography  >
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {cargando ? (
            <Typography variant='body2' style={{ whiteSpace: 'pre-line', fontSize: '1.3rem' }}>
                Cargando rutina...
            </Typography>
          ) : (
            <Typography variant='body2' style={{ whiteSpace: 'pre-line',  fontSize: '1.3rem'}}>
              {rutinas}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MiRutina;