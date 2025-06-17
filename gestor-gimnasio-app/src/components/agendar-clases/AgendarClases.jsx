import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import CircularProgress from "@mui/material/CircularProgress"
import { Button, Box, TextField } from "@mui/material"
import { green, red } from "@mui/material/colors"
import { useCallback, useEffect, useMemo, useState } from "react"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs from "dayjs"
import TurnoClaseIncripcionEstadoDto from "../../models/dtos/TurnoClaseIncripcionEstadoDto.dto"
import environment from "../../environments/environment"
import "./AgendarClases.css"
import UsuarioAcceesToken from "../../models/auth/UsuarioAccessToken"
import PropTypes from "prop-types"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import SnackbarMensaje from "../utils/SnackbarMensaje"
import CargaTabla from "../clases-carga/CargaTabla"

function Clases() {
  const [clasesParaTabla, setClasesParaTabla] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [accionEnProgreso, setAccionEnProgreso] = useState(false)
  const [accionId, setAccionId] = useState(null)
  const [busquedaActividad, setBusquedaActividad] = useState('')
  const [busquedaProfesor, setBusquedaProfesor] = useState('')
  const [busquedaFecha, setBusquedaFecha] = useState(null)
  const usuario = useMemo(() => new UsuarioAcceesToken(JSON.parse(localStorage.getItem("usuario"))).usuario, [])
  const token = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  const clasesFiltradas = useMemo(() => {
    let filtradas = clasesParaTabla

    if (busquedaActividad.trim()) {
      filtradas = filtradas.filter((clase) =>
        clase.tipoActividad.toLowerCase().includes(busquedaActividad.toLowerCase())
      )
    }

    if (busquedaProfesor.trim()) {
      filtradas = filtradas.filter((clase) => {
        const nombreCompleto = `${clase.nombresProfesor} ${clase.apellidosProfesor}`.toLowerCase()
        return nombreCompleto.includes(busquedaProfesor.toLowerCase())
      })
    }

    if (busquedaFecha) {
      const fechaBusqueda = dayjs(busquedaFecha).format('YYYY-MM-DD')
      filtradas = filtradas.filter((clase) => {
        const fechaClase = clase.fecha.split(' ')[0]
        return fechaClase === fechaBusqueda
      })
    }

    return filtradas
  }, [clasesParaTabla, busquedaActividad, busquedaProfesor, busquedaFecha])

  const resetBuscadores = useCallback(() => {
    setBusquedaActividad('')
    setBusquedaProfesor('')
    setBusquedaFecha(null)
  }, [])

  const handleCloseSnackbar = (event, reason) => {
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

  const handleInscribirClick = async (idTurnoClase) => {
    setAccionEnProgreso(true)
    setAccionId(idTurnoClase)

    try {
      const response = await fetch(`${environment.apiUrl}/inscripciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idUsuario: usuario.id,
          idTurnoClase,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido al inscribirse" }))
        throw new Error(errorData.message || "Error al inscribirse a la clase")
      }

      showSnackbar("Inscripción realizada con éxito", "success")
      await getClasesInscripcionUsuario(usuario, token)
    } catch (error) {
      showSnackbar(error.message || "Error al inscribirse a la clase", "error")
    } finally {
      setAccionEnProgreso(false)
      setAccionId(null)
    }
  }

  const handleCancelarInscripcionClick = async (idTurnoClase) => {
    setAccionEnProgreso(true)
    setAccionId(idTurnoClase)

    try {
      const response = await fetch(`${environment.apiUrl}/inscripciones/${usuario.id}/${idTurnoClase}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al cancelar la inscripción" }))
        throw new Error(errorData.message || "Error al cancelar la inscripción")
      }

      showSnackbar("Inscripción cancelada con éxito", "success")
      await getClasesInscripcionUsuario(usuario, token)
    } catch (error) {
      showSnackbar(error.message || "Error al cancelar la inscripción", "error")
    } finally {
      setAccionEnProgreso(false)
      setAccionId(null)
    }
  }
  const getClasesInscripcionUsuario = useCallback(
    async (usuario, token) => {
      setClasesParaTabla([])
      resetBuscadores()
      setIsLoading(true)
      const idUsuario = usuario.id

      try {
        const response = await fetch(`${environment.apiUrl}/turnos-clase/user-inscription-status/${idUsuario}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los datos de las clases")
        }

        const data = await response.json()
        const dataDto = data.map((item) => new TurnoClaseIncripcionEstadoDto(item))
        setClasesParaTabla(dataDto)
      } catch (error) {
        showSnackbar(error.message || "Error al tratar de obtener las clases", "error")
        setClasesParaTabla([])
      } finally {
        setIsLoading(false)
      }
    },
    [showSnackbar, resetBuscadores]
  )

  useEffect(() => {
    getClasesInscripcionUsuario(usuario, token)
  }, [getClasesInscripcionUsuario, usuario, token])
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h2 className="titulo-clases">Próximas clases</h2>

      <Box
        sx={{
          maxWidth: 900,
          width: '100%',
          mb: 2,
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label="Buscar Actividad"
          variant="outlined"
          size="small"
          value={busquedaActividad}
          onChange={(e) => setBusquedaActividad(e.target.value)}
          disabled={isLoading}
          placeholder="Ej: Yoga, Pilates, Zumba..."
          sx={{
            width: '100%',
            maxWidth: 280,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
            },
          }}
        />

        <TextField
          label="Buscar Profesor"
          variant="outlined"
          size="small"
          value={busquedaProfesor}
          onChange={(e) => setBusquedaProfesor(e.target.value)}
          disabled={isLoading}
          placeholder="Ej: Juan, Maria, Pedro..."
          sx={{
            width: '100%',
            maxWidth: 280,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
            },
          }}
        />

        <DatePicker
          label="Buscar Fecha"
          value={busquedaFecha}
          onChange={(nuevaFecha) => setBusquedaFecha(nuevaFecha)}
          format="DD/MM/YYYY"
          disabled={isLoading}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                width: '100%',
                maxWidth: 280,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff',
                },
              },
            },
          }}
        />

        <Box sx={{
          maxWidth: 1200,
          minWidth: 900,
          width: '90vw',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          mt: 2,
        }}>
          <Button
            variant="outlined"
            className="boton-principal"
            onClick={resetBuscadores}
            disabled={isLoading}
          >
            Limpiar Filtros
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} className="clases-table">
        {isLoading ? (
          <CargaTabla texto="Cargando clases..." />
        ) : (
          <ClasesTabla
            clases={clasesFiltradas}
            onInscribirClick={handleInscribirClick}
            onCancelarInscripcionClick={handleCancelarInscripcionClick}
            accionEnProgreso={accionEnProgreso}
            accionId={accionId}
          />
        )}
      </TableContainer>

      <SnackbarMensaje
        abrirSnackbar={abrirSnackbar}
        duracionSnackbar={5000}
        handleCloseSnackbar={handleCloseSnackbar}
        mensajeSnackbar={mensajeSnackbar}
        snackbarSeverity={snackbarSeverity}
      />
    </LocalizationProvider>
  )
}

function ClasesTabla({ clases, onInscribirClick, onCancelarInscripcionClick, accionEnProgreso, accionId }) {
  const encabezadoTabla = () => {
    return (
      <TableHead className="cabecera-tabla">
        <TableRow>
          <TableCell>ACTIVIDAD</TableCell>
          <TableCell>PROFESOR</TableCell>
          <TableCell>FECHA</TableCell>
          <TableCell>DESDE</TableCell>
          <TableCell>HASTA</TableCell>
          <TableCell>DISPONIBILIDAD</TableCell>
          <TableCell>INSCRIPTO</TableCell>
          <TableCell>ACCIÓN</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  const renderizarBotonAcciones = (clase, disponibilidad, isCurrentActionTarget) => {
    if (clase.inscripto) {
      return (
        <Button
          variant="outlined"
          className="boton-secundario"
          onClick={() => onCancelarInscripcionClick(clase.idTurnoClase)}
          disabled={accionEnProgreso}
        >
          {isCurrentActionTarget ? <CircularProgress size={24} color="inherit" /> : "Cancelar Inscripción"}
        </Button>
      )
    }

    if (disponibilidad <= 0) {
      return (
        <Button variant="outlined" disabled>
          Sin disponibilidad
        </Button>
      )
    }

    return (
      <Button
        variant="outlined"
        className="boton-principal"
        onClick={() => onInscribirClick(clase.idTurnoClase)}
        disabled={accionEnProgreso}
      >
        {isCurrentActionTarget ? <CircularProgress size={24} color="inherit" /> : "Inscribirse"}
      </Button>
    )
  }

  if (!clases || clases.length === 0) {
    return (
      <Table sx={{ minWidth: 900 }} aria-label="tabla de clases">
        {encabezadoTabla()}
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} align="center">
              No hay clases para mostrar
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table sx={{ minWidth: 900 }} aria-label="tabla de clases">
      {encabezadoTabla()}
      <TableBody>
        {clases.map((clase) => {
          const soloFechas = clase.fecha.split(" ")[0].split("-")
          const fechaFormateada = `${soloFechas[2]}/${soloFechas[1]}/${soloFechas[0]}`
          const nombreProfe = `${clase.nombresProfesor} ${clase.apellidosProfesor}`
          const isCurrentActionTarget = accionEnProgreso && accionId === clase.idTurnoClase
          const disponibilidad = clase.cupoMaximo - clase.totalInscriptos

          return (
            <TableRow key={clase.idTurnoClase} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>{clase.tipoActividad}</TableCell>
              <TableCell>{nombreProfe}</TableCell>
              <TableCell>{fechaFormateada}</TableCell>
              <TableCell>{clase.horarioDesde.slice(0, 5)}</TableCell>
              <TableCell>{clase.horarioHasta.slice(0, 5)}</TableCell>
              <TableCell>{disponibilidad}/{clase.cupoMaximo}</TableCell>
              <TableCell>
                {clase.inscripto ? (
                  <CheckCircleOutlineIcon sx={{ color: green[500] }} />
                ) : (
                  <HighlightOffIcon sx={{ color: red[500] }} />
                )}
              </TableCell>
              <TableCell>{renderizarBotonAcciones(clase, disponibilidad, isCurrentActionTarget)}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

ClasesTabla.propTypes = {
  clases: PropTypes.arrayOf(PropTypes.instanceOf(TurnoClaseIncripcionEstadoDto)).isRequired,
  onInscribirClick: PropTypes.func.isRequired,
  onCancelarInscripcionClick: PropTypes.func.isRequired,
  accionEnProgreso: PropTypes.bool.isRequired,
  accionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default Clases
