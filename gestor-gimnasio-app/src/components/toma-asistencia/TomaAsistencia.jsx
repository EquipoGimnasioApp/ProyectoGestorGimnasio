import { useState, useEffect, useMemo, useCallback } from 'react'
import { Box, Typography, Paper, FormControl, Select, MenuItem, Checkbox, FormControlLabel, Button } from '@mui/material'
import SnackbarMensaje from "../utils/SnackbarMensaje"
import environment from "../../environments/environment"
import CargaTabla from "../clases-carga/CargaTabla"



export default function TomaAsistencia() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])

  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  const [cargando, setCargando] = useState(true)
  const [cargandoGuardado, setCargandoGuardado] = useState(false);

  const [turnoClases, setTurnoClases] = useState([])
  const [alumnos, setAlumnos] = useState([])
  const [cargandoAlumnos, setCargandoAlumnos] = useState(false)
  const [claseSeleccionada, setClaseSeleccionada] = useState("")
  const [asistencia, setAsistencia] = useState({})

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") {
      return
    }

    setAbrirSnackbar(false)
  }

  const showSnackbar = useCallback((mensaje, severidad) => {
    setMensajeSnackbar(mensaje)
    setSnackbarSeverity(severidad)
    setAbrirSnackbar(true)
  }, [])

  const getTurnoClases = useCallback(
    async (token) => {
      setTurnoClases([])
      setCargando(true)

      try {
        const response = await fetch(`${environment.apiUrl}/turnos-clase`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener las clases")
        }

        const data = await response.json()
        setTurnoClases(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener las clases", "error")
        setTurnoClases([])
      } finally {
        setCargando(false)
      }
    },
    [showSnackbar]
  )

  const getAlumnosClase = useCallback(
    async (token, claseId) => {
      setAlumnos([])
      setCargandoAlumnos(true)

      try {
        const response = await fetch(`${environment.apiUrl}/inscripciones/turnos-clase/${claseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los alumnos")
        }

        const data = await response.json()
        const usuarios = data.map(inscripcion =>
          inscripcion.usuario
        )
        setAlumnos(usuarios)
        const asistencia = data.reduce((acc, inscripcion) => {
          acc[inscripcion.id_usuario] = inscripcion.presente
          return acc
        }, {})
        setAsistencia(asistencia)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener los alumnos", "error")
        setAlumnos([])
      } finally {
        setCargandoAlumnos(false)
      }
    },
    [showSnackbar]
  )

  useEffect(() => {
    getTurnoClases(userToken)
  }, [userToken, getTurnoClases])

  const toggleAsistenciaAlumno = (idAlumno) => {
    setAsistencia({
      ...asistencia,
      [idAlumno]: !asistencia[idAlumno],
    })
  }

  const guardarAsistencia = async () => {
    const datos = alumnos.map(alumno => ({
      idAlumno: alumno.id,
      presente: asistencia[alumno.id] ? 1 : 0,
    }))

    setCargandoGuardado(true);

    setAlumnos([]);
    setAsistencia({});
    try {
      const response = await fetch(`${environment.apiUrl}/inscripciones/cargar-asistencia/${claseSeleccionada}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(datos),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al cargar asistencia")
      }

      showSnackbar("Asistencia cargada exitosamente", "success")
      setClaseSeleccionada("");
    } catch (error) {
      showSnackbar(error.message ?? "Error al cargar asistencia", "error")
    } finally {
      setCargandoGuardado(false);
    }

  }

  const hoy = new Date()
  const dia = String(hoy.getDate()).padStart(2, '0')
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const anio = hoy.getFullYear()
  const hoyStr = `${dia}/${mes}/${anio}`

  // Filtrar las clases del día de hoy
  const turnoClasesHoy = turnoClases.filter(clase => clase.fecha === hoyStr)

  const handleSeleccionClase = (event) => {
    const claseId = event.target.value
    setClaseSeleccionada(claseId)
    getAlumnosClase(userToken, claseId)
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 8, background: '#fff' }}>
      <Typography variant="h4" fontWeight={700} mb={4} align="center">
        Tomar Asistencia
      </Typography>
      <Paper elevation={1} sx={{
        p: 4, borderRadius: 3, minWidth: 500, maxWidth: 540, mx: 'auto', border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
        boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)'
      }}>
        {cargando ? (
          <CargaTabla texto='Cargando clases...' />
        )
          : (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography fontSize={20} fontWeight={500} sx={{ mr: 2 }}>
                Seleccionar clase:
              </Typography>
              <FormControl fullWidth sx={{ maxWidth: 250 }}>
                <Select
                  value={claseSeleccionada}
                  displayEmpty
                  onChange={handleSeleccionClase}
                  sx={{ background: '#fff' }}
                >
                  <MenuItem value="" disabled>Seleccione una clase</MenuItem>
                  {turnoClasesHoy.map(clase => (
                    <MenuItem key={clase.id} value={clase.id}>
                      {clase.tipoActividad.charAt(0).toUpperCase() + clase.tipoActividad.slice(1).toLowerCase()} - {clase.horarioDesde} a {clase.horarioHasta}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

        {claseSeleccionada && (
          <>
            <Box sx={{ mb: 3, pl: 5 }}>
              {cargandoGuardado ? (
                <CargaTabla texto='Guardando asistencia...' />
              ) : cargandoAlumnos ? (
                <CargaTabla texto='Cargando alumnos...' />
              ) : alumnos.length === 0 ? (
                <Typography color='text.secondary' align='center' sx={{ my: 2 }}>
                  No hay alumnos inscriptos para esta clase.
                </Typography>
              ) : (
                alumnos.map(alumno => (
                  <FormControlLabel
                    key={alumno.id}
                    control={
                      <Checkbox
                        checked={asistencia[alumno.id] || false}
                        onChange={() => toggleAsistenciaAlumno(alumno.id)}
                        sx={{ color: '#000' }}
                      />
                    }
                    label={
                      <Typography fontSize={18}>
                        {alumno.nombres} {alumno.apellidos}
                      </Typography>
                    }
                    sx={{ display: 'flex', mb: 1 }}
                  />
                ))
              )}
            </Box>
            <Button
              variant='contained'
              fullWidth
              sx={{
                background: '#000',
                color: '#fff',
                borderRadius: 2,
                py: 1.2,
                fontWeight: 600,
                fontSize: 16,
                boxShadow: 'none',
                '&:hover': { background: '#222' }
              }}
              onClick={guardarAsistencia}
              disabled={cargando || alumnos.length === 0}
            >
              Guardar asistencia
            </Button>
          </>
        )}
      </Paper>
      <SnackbarMensaje
        abrirSnackbar={abrirSnackbar}
        duracionSnackbar={5000}
        handleCloseSnackbar={handleCloseSnackbar}
        mensajeSnackbar={mensajeSnackbar}
        snackbarSeverity={snackbarSeverity}
      />
    </Box>
  )
}
