import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material'
import { EventNote } from '@mui/icons-material'
import environment from '../../environments/environment'
import dayjs from 'dayjs'
import CargaTabla from '../clases-carga/CargaTabla'


const AlumnoDashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [proximasClases, setProximasClases] = useState([])
  const [cargandoClases, setCargandoClases] = useState(true)

  useEffect(() => {
    const fetchProximasClases = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/inscripciones/turnos-clase/usuario/${usuario.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setProximasClases(data)
          setCargandoClases(false)
        } else {
          setProximasClases([])
          setCargandoClases(false)
        }
      } catch {
        setProximasClases([])
        setCargandoClases(false)
      }
    }
    fetchProximasClases()
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
        <Typography variant="h4" gutterBottom>
          👋 ¡Hola {capitalizarNombre(usuario.nombres)}!
        </Typography>
        <Typography variant="h6" marginBottom={4}>
          ¡Nos alegra verte de nuevo! Desde aquí podés reservar clases, ver tu agenda y mantenerte en contacto con tus profesores.
        </Typography>

        {/* Próximas clases */}
        <Grid item xs={12} marginBottom={4}>
          <Card>
            <CardContent
              sx={{
                border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
                boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)',
                minHeight: 120,
                width: 1000,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="h6">📅 Tus próximas clases</Typography>
              <ul className="list-disc pl-5">
                {cargandoClases ? (
                  <CargaTabla texto='Cargando próximas clases...' />
                ) : (
                  proximasClases.length === 0 ? (
                    <li>No tenés clases agendadas.</li>
                  ) : (
                    proximasClases
                      .filter(clase => clase.turno_clase)
                      .map((clase) => (
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
        <Grid item xs={12} md={6} lg={3}>
          <Typography variant='body1' color='text.secondary' align='center' sx={{ mt: 2 }}>
            Y recordá que: “La constancia es más importante que la intensidad.”
          </Typography>
        </Grid>
      </Paper>
    </div>
  )
}

export default AlumnoDashboard
