import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { Today, AssignmentTurnedIn, Message } from '@mui/icons-material';

const ProfesorDashboard = ({ profesorName = "Profesor/a" }) => {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        👋 Hola, profe {profesorName}
      </Typography>
      <Typography variant="body1" marginBottom={2}>
        ¡Gracias por tu compromiso con nuestros alumnos! Desde acá podés gestionar tus clases, tomar asistencia y responder mensajes.
      </Typography>

      {/* Clases del día */}
      <Grid item xs={12} marginBottom={4}>
        <Card>
          <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
            <Typography variant="h6">🗓️ Hoy tenés:</Typography>
            <ul className="list-disc pl-5">
              <li>Funcional – 19:00hs – 12 alumnos inscriptos</li>
              <li>HIIT – 20:00hs – 9 alumnos inscriptos</li>
            </ul>
          </CardContent>
        </Card>
      </Grid>

      {/* Tareas pendientes */}
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


      {/* Mensaje final */}
      <Grid item xs={12}>
        <Typography variant="body2" color="text.secondary" align="center">
          Y recordá: “Un buen entrenamiento comienza con una buena actitud.”
        </Typography>
      </Grid>
    </div>
  );
};

export default ProfesorDashboard;
