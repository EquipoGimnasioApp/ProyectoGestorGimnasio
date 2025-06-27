import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { EventNote, Message, Today } from '@mui/icons-material';

const usuario = JSON.parse(localStorage.getItem('usuario'))
const AlumnoDashboard = ({ alumnoName = usuario.nombres }) => {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        👋 Bienvenido/a, {alumnoName}
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
              <li>Lunes 18/06 – Funcional 19:00hs – Profesor/a: Martín R.</li>
              <li>Miércoles 20/06 – Yoga 18:00hs – Profesor/a: Laura B.</li>
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
