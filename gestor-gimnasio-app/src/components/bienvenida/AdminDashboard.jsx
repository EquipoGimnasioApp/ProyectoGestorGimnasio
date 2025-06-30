import React, { useMemo, useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material'
import environment from '../../environments/environment'
import dayjs from 'dayjs'
import CargaTabla from '../clases-carga/CargaTabla'

const AdminDashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [clasesHoy, setClasesHoy] = useState(0)
  const [cargaClases, setCargando] = useState(true)
  const [alumnosActivos, setAlumnosActivos] = useState(0)
  const [cargandoAlumnos, setCargandoAlumnos] = useState(true)
  const [profesoresActivos, setProfesoresActivos] = useState(0)
  const [cargandoProfesores, setCargandoProfesores] = useState(true)

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
        })
        if (response.ok) {
          const data = await response.json()
          const clasesDeHoy = data.filter(clase => dayjs(clase.fecha).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
          setClasesHoy(clasesDeHoy.length)
          setCargando(false)
        } else {
          setClasesHoy(0)
          setCargando(false)
        }
      } catch {
        setClasesHoy(0)
      }
    }

    //Obtener alumnos activos
    const fetchAlumnosActivos = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/alumnos`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setAlumnosActivos(data.length)
        } else {
          setAlumnosActivos(0)
        }
      } catch {
        setAlumnosActivos(0)
      } finally {
        setCargandoAlumnos(false)
      }
    }

    //Obtener profesores activos
    const fetchProfesoresActivos = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/profesores`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          setProfesoresActivos(data.length)
          setCargandoProfesores(false)
        } else {
          setProfesoresActivos(0)
          setCargandoProfesores(false)
        }
      } catch {
        setProfesoresActivos(0)
        setCargandoProfesores(false)
      }
    }

    fetchClasesHoy()
    fetchAlumnosActivos()
    fetchProfesoresActivos()
  }, [])

  function capitalizarNombre(nombre) {
    return (nombre)
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
        <Typography variant='h4' gutterBottom>
          👋 ¡Hola {capitalizarNombre(usuario.nombres)}!
        </Typography>
        <Typography variant='h6' marginBottom={4}>
          Tenés el control del gimnasio. Podés gestionar usuarios, clases, equipamiento, y más.
        </Typography>

        <Grid container spacing={3} justifyContent='center'>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent
                sx={{
                  border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
                  boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)',
                  minHeight: 120,
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {cargaClases ? (
                  <CargaTabla texto='Cargando clases...' />
                ) : (
                  <>
                    <Typography variant='h6' align='center'>📍 Clases del día</Typography>
                    <Typography variant='h4' align='center'>{clasesHoy}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent
                sx={{
                  border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
                  boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)',
                  minHeight: 120,
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {cargandoAlumnos ? (
                  <CargaTabla texto='Cargando alumnos...' />
                ) : (
                  <>
                    <Typography variant='h6' align='center'>👥 Cantidad de Alumnos</Typography>
                    <Typography variant='h4' align='center'>{alumnosActivos}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent
                sx={{
                  border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
                  boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)',
                  minHeight: 120,
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {cargandoProfesores ? (
                  <CargaTabla texto='Cargando profesores...' />
                ) : (
                  <>
                    <Typography variant='h6' align='center'>👨‍🏫 Profesores</Typography>
                    <Typography variant='h4' align='center'>{profesoresActivos}</Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Typography variant='body1' color='text.secondary' align='center' sx={{ mt: 6 }}>
            “El orden y la planificación hacen que el gimnasio funcione mejor.”
          </Typography>
        </Grid>
      </Paper>
    </div>
  )
}

export default AdminDashboard
