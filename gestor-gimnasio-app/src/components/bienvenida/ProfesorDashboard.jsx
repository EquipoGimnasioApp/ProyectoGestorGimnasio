import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { getClasesProfesor } from '../../services/clasesProfesorService';

const usuario = JSON.parse(localStorage.getItem('usuario'));

const ProfesorDashboard = ({ profesorName = usuario.nombres }) => {
  const [clases, setClases] = useState([]);
  const [cargando, setCargando] = useState(true);
  const token = localStorage.getItem('usuarioAccesToken');

  useEffect(() => {
    const fetchClases = async () => {
      setCargando(true);
      try {
        const data = await getClasesProfesor(usuario.id, token);
        setClases(data);
      } catch (e) {
        setClases([]);
      } finally {
        setCargando(false);
      }
    };
    fetchClases();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        👋 Hola, profe {profesorName}
      </Typography>
      <Typography variant="body1" marginBottom={2}>
        ¡Gracias por tu compromiso con nuestros alumnos! Desde acá podés gestionar tus clases, tomar asistencia y responder mensajes.
      </Typography>

      <Grid item xs={12} marginBottom={4}>
        <Card>
          <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
            <Typography variant="h6">📚 Todas tus clases:</Typography>
            {cargando ? (
              <Typography variant="body2">Cargando clases...</Typography>
            ) : clases.length === 0 ? (
              <Typography variant="body2">No tenés clases asignadas.</Typography>
            ) : (
              <ul className="list-disc pl-5">
                {clases.map((clase) => (
                  <li key={clase.id} style={{ marginBottom: '1.2rem' }}>
                    {clase.tipoActividad || clase.id_actividad} – {clase.fecha} – {clase.horario_desde || clase.horarioDesde}hs a {clase.horario_hasta || clase.horarioHasta}hs – Sala: {clase.descripcionSala || clase.sala || '-'} – {clase.totalInscriptos ?? '-'} alumnos inscriptos
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} marginBottom={4}>
        <Card>
          <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
            <Typography variant="h6">📌 Tareas pendientes</Typography>
            <ul className="list-disc pl-5">
              <li>📝 Tomar lista en clase HIIT</li>
              <li>📬 Responder 1 mensaje nuevo</li>
            </ul>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" align="center">
          Y recordá: “Un buen entrenamiento comienza con una buena actitud.”
        </Typography>
      </Grid>
    </div>
  );
};

export default ProfesorDashboard;
