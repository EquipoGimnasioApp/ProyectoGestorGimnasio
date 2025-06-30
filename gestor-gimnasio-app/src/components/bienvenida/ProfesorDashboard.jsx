import React, { useEffect, useState } from 'react'
import { Card, CardContent, Typography, Grid, Paper } from '@mui/material'
import { getClasesProfesor } from '../../services/clasesProfesorService'
import CargaTabla from '../clases-carga/CargaTabla'

const usuario = JSON.parse(localStorage.getItem('usuario'))

const ProfesorDashboard = ({ profesorName = usuario.nombres }) => {
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)
  const token = localStorage.getItem('usuarioAccesToken')

  useEffect(() => {
    const fetchClases = async () => {
      setCargando(true)
      try {
        const data = await getClasesProfesor(usuario.id, token)
        setClases(data)
      } catch {
        setClases([])
      } finally {
        setCargando(false)
      }
    }
    fetchClases()
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
          👋 ¡Hola profe {capitalizarNombre(profesorName)}!
        </Typography>
        <Typography variant="h6" marginBottom={4}>
          ¡Gracias por tu compromiso con nuestros alumnos! Desde acá podés gestionar tus clases, tomar asistencia y responder mensajes.
        </Typography>

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
              {cargando ? (
                <CargaTabla texto='Cargando clases...' />
              ) : (
                <>
                  <Typography variant='h6'>📚 Tus clases:</Typography>
                  {clases.length === 0 ? (
                    <Typography variant='body1'>No tenés clases asignadas.</Typography>
                  ) : (
                    <ul className='list-disc pl-5'>
                      {clases.map(clase => (
                        <li key={clase.id} style={{ marginBottom: '1.2rem' }}>
                          {clase.tipoActividad || clase.id_actividad} – {clase.fecha} – {clase.horario_desde || clase.horarioDesde}hs a {clase.horario_hasta || clase.horarioHasta}hs – Sala: {clase.descripcionSala || clase.sala || '-'} – {clase.totalInscriptos ?? '-'} alumnos inscriptos
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>



        <Grid item xs={12} md={6} lg={3}>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2 }}>
            Y recordá: “Un buen entrenamiento comienza con una buena actitud.”
          </Typography>
        </Grid>
      </Paper>
    </div>
  )
}

export default ProfesorDashboard
