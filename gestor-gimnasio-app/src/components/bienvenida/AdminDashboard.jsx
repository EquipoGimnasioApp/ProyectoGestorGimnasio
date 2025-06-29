import React, { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { BarChart, People, Message, Warning, EventNote, Settings } from '@mui/icons-material';
import environment from '../../environments/environment';
import dayjs from 'dayjs';

const AdminDashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  // Clases
  const [clasesHoy, setClasesHoy] = useState(0)
  const [cargaClases, setCargando] = useState(true);
  // Alumnos activos
  const [alumnosActivos, setAlumnosActivos] = useState(0);
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true);
  // Profesores
  const [profesoresActivos, setProfesoresActivos] = useState(0);
  const [cargandoProfesores, setCargandoProfesores] = useState(true);

  useEffect(() => {
    // obtener las clases de hoy
    const fetchClasesHoy = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/turnos-clase`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json()
          const clasesDeHoy = data.filter(clase => dayjs(clase.fecha).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'));
          setClasesHoy(clasesDeHoy.length)
          setCargando(false)
        } else {
          setClasesHoy(0)
          setCargando(false)
        }
      } catch {
        setClasesHoy(0)
      }
    };

    //Obtener alumnos activos
    const fetchAlumnosActivos = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/alumnos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setAlumnosActivos(data.length);
          setCargandoAlumnos(false);
        } else {
          setAlumnosActivos(0);
          setCargandoAlumnos(false);
        }
      } catch {
        setAlumnosActivos(0);
        setCargandoAlumnos(false);
      }
    };

    //Obtener profesores activos
    const fetchProfesoresActivos = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/profesores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProfesoresActivos(data.length);
          setCargandoProfesores(false);
        } else {
          setProfesoresActivos(0);
          setCargandoProfesores(false);
        }
      } catch {
        setProfesoresActivos(0);
        setCargandoProfesores(false);
      }
    };

    fetchClasesHoy();
    fetchAlumnosActivos();
    fetchProfesoresActivos();
  }, [])


  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" gutterBottom>
        👋 Bienvenido/a, {usuario.nombres}
      </Typography>
      <Typography variant="body1" marginBottom={4}>
        Tenés el control del gimnasio. Podés gestionar usuarios, clases, equipamiento, y más.
      </Typography>

      <Grid container spacing={3}>
        {/* Estado general */}
        {/*CLASES HOY */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">📍 Clases del día</Typography>
              <Typography variant='h4'>{cargaClases ? 'Cargando...' : clasesHoy}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/*ALUMNOS ACTIVOS */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">👥 Cantidad de Alumnos</Typography>
              <Typography variant="h4">{cargandoAlumnos ? 'Cargando...' : alumnosActivos}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/*PROFESORES */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
              <Typography variant="h6">👨‍🏫 Profesores</Typography>
              <Typography variant="h4">{cargandoProfesores ? 'Cargando...' : profesoresActivos}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* Mensaje final */}
      <Grid item xs={12} md={6} lg={3}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          “El orden y la planificación hacen que el gimnasio funcione mejor.”
        </Typography>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
