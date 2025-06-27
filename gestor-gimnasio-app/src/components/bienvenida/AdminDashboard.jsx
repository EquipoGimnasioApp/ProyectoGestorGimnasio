import React from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { BarChart, People, Message, Warning, EventNote, Settings } from '@mui/icons-material';

const usuario = JSON.parse(localStorage.getItem('usuario'))
const AdminDashboard = ({ adminName = usuario.nombres }) => {

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        👋 Bienvenido/a, {adminName}
      </Typography>
      <Typography variant="body1" marginBottom={4}>
        Tenés el control del gimnasio. Podés gestionar usuarios, clases, equipamiento, y más.
      </Typography>

      <Grid container spacing={3}>
        {/* Estado general */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">📍 Clases hoy</Typography>
              <Typography variant="h4">8</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">👥 Alumnos activos</Typography>
              <Typography variant="h4">120</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">👨‍🏫 Profesores</Typography>
              <Typography variant="h4">7</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">💬 Mensajes sin responder</Typography>
              <Typography variant="h4">4</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Alertas */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#fff3cd', borderLeft: '5px solid #ffecb5' }}>
            <CardContent>
              <Typography variant="h6" color="text.primary">
                ⚠️ Alertas del sistema
              </Typography>
              <ul className="list-disc pl-5">
                <li>2 clases sin profesor asignado</li>
                <li>3 pagos pendientes a revisar</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>

        {/* Mensaje final */}
        <Grid item xs={12}>
          <Typography variant="body2" color="text.secondary" align="center">
            “El orden y la planificación hacen que el gimnasio funcione mejor.”
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
