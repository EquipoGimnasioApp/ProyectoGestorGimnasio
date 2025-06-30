import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, Typography, Grid } from '@mui/material'
import environment from '../../environments/environment'
import Paper from '@mui/material/Paper'
import CargaTabla from '../clases-carga/CargaTabla'

const MiRutina = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [rutinas, setRutinas] = useState("")
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const response = await fetch(`${environment.apiUrl}/rutina/${usuario.id}`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          if (!data || !data.descripcion || data.descripcion === '') {
            setRutinas('No tienes una rutina asignada')
          } else {
            setRutinas(data.descripcion)
          }
          setCargando(false)
        } else {
          setRutinas("No tienes una rutina asignada")
          setCargando(false)
        }
      } catch {
        setRutinas("Error al cargar la rutina")
        setCargando(false)
      }
    }

    fetchRutina()
  }, [])

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
        <Typography variant='h4' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} gutterBottom>
          🏋️‍♂️ Mi Rutina de Gimnasio
        </Typography>
        <Typography variant='h6' marginBottom={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          Esta es tu rutina semanal. ¡Dale con todo!
        </Typography  >
        <Card sx={{ padding: 4, width: '100%', maxWidth: 800, boxShadow: '0 8px 32px rgba(60,60,60,0.18)', border: 'rgba(60, 60, 60, 0.22) 0.5px solid' }}>
          <CardContent>
            {cargando ? (
              <CargaTabla texto='Cargando rutina...' />
            ) : (
              <Typography variant='body2' style={{ whiteSpace: 'pre-line', fontSize: '1.3rem' }}>
                {rutinas}
              </Typography>
            )}
          </CardContent>
        </Card>

      </Paper>
    </div >
  )
}

export default MiRutina