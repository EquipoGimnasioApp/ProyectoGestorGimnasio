import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { EventNote } from '@mui/icons-material';
import environment from '../../environments/environment';
import dayjs from 'dayjs';


const AlumnoDashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [proximasClases, setProximasClases] = useState([]);
  const [cargandoClases, setCargandoClases] = useState(true);

  useEffect(() => {
    const fetchProximasClases = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/inscripciones/turnos-clase/usuario/${usuario.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Respuesta del backend:', data);
          setProximasClases(data);
          setCargandoClases(false);
        } else {
          setProximasClases([]);
          setCargandoClases(false);
        }
      } catch {
        setProximasClases([]);
        setCargandoClases(false);
      }
    };
    fetchProximasClases();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        👋 Bienvenido/a, {usuario.nombres}
      </Typography>
      <Typography variant="body1" marginBottom={2}>
        ¡Nos alegra verte de nuevo! Desde aquí podés reservar clases, ver tu agenda y mantenerte en contacto con tus profesores.
      </Typography>

      {/* Próximas clases */}
      <Grid item xs={12} marginBottom={4}>
        <Card>
          <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
            <Typography variant="h6">📅 Próximas clases</Typography>
            <ul className="list-disc pl-5">
              {cargandoClases ? (
                <li>Cargando próximas clases...</li>
              ) : (
                proximasClases.length === 0 ? (
                  <li>No tenés clases próximas.</li>
                ) : (
                  proximasClases.map((clase) => (
                    <li key={clase.id}>
                      {dayjs(clase.turno_clase.fecha).format('DD/MM/YYYY')} - 
                      {clase.turno_clase.tipo_actividad?.tipo} {clase.turno_clase.horario_desde}hs - 
                      Profesor/a: {clase.turno_clase.profesor?.nombres} {clase.turno_clase.profesor?.apellidos} - 
                      Sala: {clase.turno_clase.sala?.descripcion}
                    </li>
                  ))
                )
              )}
            </ul>
          </CardContent>
        </Card>
      </Grid>

      {/* Mensaje final */}
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" align="center">
          Y recordá que: “La constancia es más importante que la intensidad.”
        </Typography>
      </Grid>
    </div>
  );
};

export default AlumnoDashboard;