import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { useCallback, useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import "./AbmTurnoClase.css"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import environment from "../../environments/environment"
import CargaTabla from "../clases-carga/CargaTabla"
import SnackbarMensaje from "../utils/SnackbarMensaje"

export default function AbmTurnoClase() {
  const [busquedaActividad, setBusquedaActividad] = useState("")
  const [busquedaProfesor, setBusquedaProfesor] = useState("")
  const [busquedaFecha, setBusquedaFecha] = useState(null)
  const [turnoClases, setTurnoClases] = useState([])
  const [actividades, setActividades] = useState([])
  const [profesores, setProfesores] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cargandoActividades, setCargandoActividades] = useState(true)
  const [cargandoProfesores, setCargandoProfesores] = useState(true)
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")
  const [salas, setSalas] = useState([])
  const [cargandoSalas, setCargandoSalas] = useState(true)

  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])

  const turnoClasesFiltradas = useMemo(() => {
    let filtradas = turnoClases

    if (busquedaActividad.trim()) {
      filtradas = filtradas.filter((turno) =>
        turno.tipoActividad.toLowerCase().includes(busquedaActividad.toLowerCase())
      )
    }

    if (busquedaProfesor.trim()) {
      filtradas = filtradas.filter((turno) => turno.profesor.toLowerCase().includes(busquedaProfesor.toLowerCase()))
    }

    if (busquedaFecha) {
      const fechaBusqueda = dayjs(busquedaFecha).format("DD/MM/YYYY")
      filtradas = filtradas.filter((turno) => turno.fecha === fechaBusqueda)
    }

    return filtradas
  }, [turnoClases, busquedaActividad, busquedaProfesor, busquedaFecha])

  const resetBuscadores = useCallback(() => {
    setBusquedaActividad("")
    setBusquedaProfesor("")
    setBusquedaFecha(null)
  }, [])

  const [modalConfig, setModalConfig] = useState({
    abrir: false,
    esEdicion: false,
    turno: null,
    titulo: "",
  })

  const handleOpenModalCrear = () => {
    setModalConfig({
      abrir: true,
      esEdicion: false,
      turno: null,
      titulo: "Crear nuevo turno clase",
    })
  }

  const handleOpenModalEditar = (turnoParaEditar) => {
    setModalConfig({
      abrir: true,
      esEdicion: true,
      turno: turnoParaEditar,
      titulo: "Modificar turno clase",
    })
  }

  const handleCloseModal = () => {
    setModalConfig({
      abrir: false,
      esEdicion: false,
      turno: null,
      titulo: "",
    })
  }

  const handleConfirmarModal = async (datosTurno) => {
    handleCloseModal()
    if (modalConfig.esEdicion) {
      await updateTurnoClase(datosTurno, userToken)
    } else {
      await createTurnoCLase(datosTurno, userToken)
    }
  }

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
      resetBuscadores()
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
          throw new Error("Error al obtener los turnos de clases")
        }

        const data = await response.json()
        setTurnoClases(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener los turnos de clases", "error")
        setTurnoClases([])
      } finally {
        setCargando(false)
      }
    },
    [showSnackbar]
  )

  const getSalas = useCallback(
    async (token) => {
      setSalas([])
      setCargandoSalas(true)

      try {
        const response = await fetch(`${environment.apiUrl}/salas`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener las salas")
        }

        const data = await response.json()
        setSalas(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener las salas", "error")
        setSalas([])
      } finally {
        setCargandoSalas(false)
      }
    },
    [showSnackbar]
  )

  const createTurnoCLase = async (nuevoTurno, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/turnos-clase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoTurno),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al crear el turno de clase")
      }

      showSnackbar("Turno de clase creado exitosamente", "success")
      await getTurnoClases(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al crear el turno de clase", "error")
      setCargando(false)
    }
  }

  const updateTurnoClase = async (turnoActualizado, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/turnos-clase/${turnoActualizado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(turnoActualizado),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al modificar el turno de clase")
      }

      showSnackbar("Turno de clase modificado exitosamente", "success")
      await getTurnoClases(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al modificar el turno de clase", "error")
      setCargando(false)
    }
  }

  const getActividades = useCallback(
    async (token) => {
      setActividades([])
      setCargandoActividades(true)

      try {
        const response = await fetch(`${environment.apiUrl}/tipos-actividad`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener las actividades")
        }

        const data = await response.json()
        setActividades(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener las actividades", "error")
        setActividades([])
      } finally {
        setCargandoActividades(false)
      }
    },
    [showSnackbar]
  )

  const getProfesores = useCallback(
    async (token) => {
      setProfesores([])
      setCargandoProfesores(true)

      try {
        const response = await fetch(`${environment.apiUrl}/usuarios/profesores`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los profesores")
        }

        const data = await response.json()
        setProfesores(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener los profesores", "error")
        setProfesores([])
      } finally {
        setCargandoProfesores(false)
      }
    },
    [showSnackbar]
  )

  useEffect(() => {
    getTurnoClases(userToken)
    getActividades(userToken)
    getProfesores(userToken)
    getSalas(userToken)
  }, [userToken, getTurnoClases, getActividades, getProfesores, getSalas])

  const deleteTurnoClase = async (turnoClaseEliminado, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/turnos-clase/${turnoClaseEliminado.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al eliminar la clase")
      }

      showSnackbar("Clase eliminada exitosamente", "success")
      await getTurnoClases(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al eliminar la clase", "error")
      setCargando(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h2 className="titulo">ABM Clases</h2>

      <Box
        sx={{
          maxWidth: 900,
          width: "100%",
          mb: 2,
          display: "flex",
          gap: 2,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Buscar Actividad"
          variant="outlined"
          size="small"
          value={busquedaActividad}
          onChange={(e) => setBusquedaActividad(e.target.value)}
          disabled={cargando}
          placeholder="Ej: Yoga, Pilates, Zumba..."
          sx={{
            width: "100%",
            maxWidth: 280,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
            },
          }}
        />

        <TextField
          label="Buscar Profesor"
          variant="outlined"
          size="small"
          value={busquedaProfesor}
          onChange={(e) => setBusquedaProfesor(e.target.value)}
          disabled={cargando}
          placeholder="Ej: Juan, Maria, Pedro..."
          sx={{
            width: "100%",
            maxWidth: 280,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#ffffff",
            },
          }}
        />

        <DatePicker
          label="Buscar Fecha"
          value={busquedaFecha}
          onChange={(nuevaFecha) => setBusquedaFecha(nuevaFecha)}
          format="DD/MM/YYYY"
          disabled={cargando}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                width: "100%",
                maxWidth: 280,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#ffffff",
                },
              },
            },
          }}
        />
      </Box>

      <TableContainer component={Paper} className="equipamiento-table">
        {cargando ? (
          <CargaTabla texto="Cargando clases..." />
        ) : (
          <TurnoClasesTabla
            clases={turnoClasesFiltradas}
            onEditar={handleOpenModalEditar}
            salas={salas}
            onEliminar={(turnoClase) => deleteTurnoClase(turnoClase, userToken)}
          />
        )}
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="outlined"
          className="boton-principal"
          disabled={cargandoActividades && cargandoProfesores && cargandoSalas}
          onClick={handleOpenModalCrear}
        >
          Nueva Clase
        </Button>
        <Button variant="outlined" className="boton-principal" sx={{ ml: 2 }} onClick={() => getTurnoClases(userToken)}>
          Actualizar
        </Button>
      </Box>
      <TurnoClaseModal
        abrirModal={modalConfig.abrir}
        handleCerrar={handleCloseModal}
        handleConfirmar={handleConfirmarModal}
        actividades={actividades}
        profesores={profesores}
        turnoExistente={modalConfig.turno}
        esEdicion={modalConfig.esEdicion}
        tituloModal={modalConfig.titulo}
        salas={salas}
        cargandoSalas={cargandoSalas}
      />
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

function formatearFecha(fechaStr) {
  if (!fechaStr) return ""
  if (fechaStr.includes("-")) {
    const soloFecha = fechaStr.split(" ")[0]
    const [anio, mes, dia] = soloFecha.split("-")
    return `${dia}/${mes}/${anio}`
  }
  if (fechaStr.includes("/")) {
    return fechaStr.split(" ")[0]
  }
  return fechaStr
}

function parseFecha(fechaStr) {
  if (!fechaStr) return new Date(0)
  if (fechaStr.includes("-")) {
    const soloFecha = fechaStr.split(" ")[0]
    const [anio, mes, dia] = soloFecha.split("-")
    return new Date(`${anio}-${mes}-${dia}`)
  }
  if (fechaStr.includes("/")) {
    const soloFecha = fechaStr.split(" ")[0]
    const [dia, mes, anio] = soloFecha.split("/")
    return new Date(`${anio}-${mes}-${dia}`)
  }
  return new Date(fechaStr)
}

function TurnoClasesTabla({ clases, onEditar, onEliminar }) {
  const [openEliminar, setOpenEliminar] = useState(false)
  const [materialAEliminar, setMaterialAEliminar] = useState(null)

  const handleClickEliminar = (material) => {
    setMaterialAEliminar(material)
    setOpenEliminar(true)
  }

  const handleConfirmarEliminar = () => {
    if (materialAEliminar) {
      onEliminar(materialAEliminar)
    }
    setOpenEliminar(false)
    setMaterialAEliminar(null)
  }

  const handleCancelarEliminar = () => {
    setOpenEliminar(false)
    setMaterialAEliminar(null)
  }

  const encabezadosTabla = () => {
    return (
      <TableHead className="cabecera-tabla-abm">
        <TableRow>
          <TableCell>ACTIVIDAD</TableCell>
          <TableCell>PROFESOR</TableCell>
          <TableCell>SALA</TableCell>
          <TableCell>FECHA</TableCell>
          <TableCell>DESDE</TableCell>
          <TableCell>HASTA</TableCell>
          <TableCell>CUPO MÁXIMO</TableCell>
          <TableCell>MODIFICAR</TableCell>
          <TableCell>ELIMINAR</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  if (!clases || clases.length === 0) {
    return (
      <Table aria-label="tabla de abm turno clases">
        {encabezadosTabla()}
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} align="center">
              No hay turnos de clases para mostrar
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

function capitalizarFrase(frase) {
  return frase
    .split(' ')
    .map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(' ');
}

  return (
    <>
      <Table sx={{ minWidth: 900 }} aria-label="tabla de abm turno clases">
        {encabezadosTabla()}
        <TableBody>
          {clases.map((clase) => {
            const fechaFormateada = formatearFecha(clase.fecha)
            return (
              <TableRow key={clase.id}>
                <TableCell>
                 <TableCell> {clase.tipoActividad.charAt(0).toUpperCase() + clase.tipoActividad.slice(1).toLowerCase()} </TableCell>
                </TableCell>
                <TableCell>{capitalizarFrase(clase.profesor)}</TableCell>
                <TableCell>
                  {capitalizarFrase(clase.descripcionSala)}
                </TableCell>
                <TableCell>{fechaFormateada}</TableCell>
                <TableCell>{clase.horarioDesde}</TableCell>
                <TableCell>{clase.horarioHasta}</TableCell>
                <TableCell>{clase.cupoMaximo}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    className="boton-principal"
                    style={{ minWidth: 200 }}
                    onClick={() => onEditar(clase)}
                  >
                    Modificar
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    className="boton-principal"
                    style={{ minWidth: 200 }}
                    onClick={() => handleClickEliminar(clase)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <Modal open={openEliminar} onClose={handleCancelarEliminar}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Confirmar eliminación
          </Typography>
          <Typography sx={{ mb: 3 }}>¿Está seguro de que desea eliminar la clase?</Typography>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button variant="outlined" className="boton-secundario" onClick={handleCancelarEliminar}>
              Cancelar
            </Button>
            <Button variant="contained" className="boton-principal" onClick={handleConfirmarEliminar} color="error">
              Eliminar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

TurnoClasesTabla.propTypes = {
  clases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      idActividad: PropTypes.number.isRequired,
      tipoActividad: PropTypes.string.isRequired,
      idSala: PropTypes.number.isRequired,
      descripcionSala: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      horarioDesde: PropTypes.string.isRequired,
      horarioHasta: PropTypes.string.isRequired,
      cupoMaximo: PropTypes.number.isRequired,
    })
  ).isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
}

function TurnoClaseModal({
  abrirModal,
  handleCerrar,
  handleConfirmar,
  actividades,
  profesores,
  turnoExistente,
  esEdicion,
  tituloModal,
  salas,
}) {
  const styleModal = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    gap: 1,
  }
  const [idActividad, setIdActividad] = useState("")
  const [idProfesor, setIdProfesor] = useState("")
  const [idSala, setIdSala] = useState("")
  const [fecha, setFecha] = useState(null)
  const [horarioInicio, setHorarioInicio] = useState(null)
  const [horarioFin, setHorarioFin] = useState(null)
  const [cupoMaximo, setCupoMaximo] = useState("")
  const [idTurno, setIdTurno] = useState(null)

  const disabledConfirmButton = !idActividad || !fecha || !horarioInicio || !horarioFin || !cupoMaximo || !idSala

  const resetFormValues = () => {
    setIdActividad("")
    setIdSala("")
    setFecha(null)
    setHorarioInicio(null)
    setHorarioFin(null)
    setCupoMaximo("")
    setIdTurno(null)
  }

  const handleSubmit = () => {
    const turnoDatos = {
      id_actividad: idActividad,
      id_profesor: idProfesor,
      id_sala: idSala,
      fecha: fecha ? dayjs(fecha).format("YYYY-MM-DD") : null,
      horario_desde: horarioInicio ? dayjs(horarioInicio).format("HH:mm:ss") : null,
      horario_hasta: horarioFin ? dayjs(horarioFin).format("HH:mm:ss") : null,
      cupo_maximo: cupoMaximo ? parseInt(cupoMaximo, 10) : 0,
    }
    if (esEdicion && idTurno) {
      turnoDatos.id = idTurno
    }
    handleConfirmar(turnoDatos)
  }

  useEffect(() => {
    if (abrirModal && esEdicion && turnoExistente) {
      setIdActividad(turnoExistente.idActividad ?? "")
      setIdProfesor(turnoExistente.idProfesor ?? "")
      setIdSala(turnoExistente.idSala ?? "")
      setFecha(turnoExistente.fecha ? dayjs(turnoExistente.fecha, "DD/MM/YYYY") : null)
      setHorarioInicio(turnoExistente.horarioDesde ? dayjs(`2000-01-01T${turnoExistente.horarioDesde}`) : null)
      setHorarioFin(turnoExistente.horarioHasta ? dayjs(`2000-01-01T${turnoExistente.horarioHasta}`) : null)
      setCupoMaximo(turnoExistente.cupoMaximo?.toString() ?? "")
      setIdTurno(turnoExistente.id ?? null)
    } else {
      resetFormValues()
    }
  }, [abrirModal, esEdicion, turnoExistente])

  const handleCupoMaximoChange = (event) => {
    event.preventDefault()
    const value = event.target.value

    if (value === "") {
      setCupoMaximo("")
      return
    }

    const regexSoloDigitos = /^\d+$/
    if (!regexSoloDigitos.test(value)) {
      return
    }

    setCupoMaximo(value.slice(0, 3))
  }

  const handleSalaChange = (event) => {
    setIdSala(event.target.value)
  }

  return (
    <Modal
      open={abrirModal}
      onClose={handleCerrar}
      aria-labelledby="modal-crear-turno-clase-title"
      aria-describedby="modal-crear-turno-clase-description"
    >
      <Box sx={styleModal}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, color: "black", textAlign: "center" }}>
          {tituloModal}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel id="actividad-select-label">Actividad</InputLabel>
          <Select
            labelId="actividad-select-label"
            id="actividad-select"
            value={idActividad}
            label="Actividad"
            onChange={(e) => setIdActividad(e.target.value)}
          >
            <MenuItem value="">
              <em>Seleccione una Actividad</em>
            </MenuItem>
            {actividades.map((actividad) => {
              return (
                <MenuItem key={actividad.id} value={actividad.id}>
                  {actividad.tipo.charAt(0).toUpperCase() + actividad.tipo.slice(1).toLowerCase()}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="profesor-select-label">Profesor</InputLabel>
          <Select
            labelId="profesor-select-label"
            id="profesor-select"
            value={idProfesor}
            label="Profesor"
            onChange={(e) => setIdProfesor(e.target.value)}
          >
            <MenuItem value="">
              <em>Seleccione un Profesor</em>
            </MenuItem>
            {profesores.map((profesor) => {
              const nombresCapitalizados =
                profesor.nombres.charAt(0).toUpperCase() + profesor.nombres.slice(1).toLowerCase()
              const apellidosCapitalizados =
                profesor.apellidos.charAt(0).toUpperCase() + profesor.apellidos.slice(1).toLowerCase()
              const nombreCompleto = `${nombresCapitalizados} ${apellidosCapitalizados}`
              return (
                <MenuItem key={profesor.id} value={profesor.id}>
                  {nombreCompleto}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <InputLabel id="sala-select-label">Sala</InputLabel>
          <Select
            labelId="sala-select-label"
            id="sala-select"
            value={idSala}
            label="Sala"
            onChange={handleSalaChange}
          >
            <MenuItem value="">
              <em>Seleccione una Sala</em>
            </MenuItem>
            {salas.map((sala) => {
              return (
                <MenuItem key={sala.id} value={sala.id}>
                  {sala.descripcion.charAt(0).toUpperCase() +
                    sala.descripcion.slice(1).toLowerCase()}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        <DatePicker
          label="Fecha"
          value={fecha}
          onChange={(nuevaFecha) => setFecha(nuevaFecha)}
          format="DD/MM/YYYY"
          sx={{ width: "100%", mt: 1, mb: 1 }}
          slotProps={{ textField: { margin: "normal", fullWidth: true } }}
        />

        <TimePicker
          label="Horario Inicio"
          value={horarioInicio}
          onChange={(nuevoHorario) => setHorarioInicio(nuevoHorario)}
          format="HH:mm"
          sx={{ width: "100%", mt: 1, mb: 1 }}
          slotProps={{ textField: { margin: "normal", fullWidth: true } }}
        />

        <TimePicker
          label="Horario Fin"
          value={horarioFin}
          onChange={(nuevoHorario) => setHorarioFin(nuevoHorario)}
          format="HH:mm"
          sx={{ width: "100%", mt: 1, mb: 1 }}
          slotProps={{ textField: { margin: "normal", fullWidth: true } }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Cupo Máximo"
          type="text"
          value={cupoMaximo}
          onChange={handleCupoMaximoChange}
          slotProps={{
            htmlInput: {
              minLength: 1,
              maxLength: 3,
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
          <Button variant="outlined" className="boton-secundario" onClick={handleCerrar}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={disabledConfirmButton}>
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

TurnoClaseModal.propTypes = {
  abrirModal: PropTypes.bool.isRequired,
  handleCerrar: PropTypes.func.isRequired,
  handleConfirmar: PropTypes.func.isRequired,
  actividades: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      tipo: PropTypes.string.isRequired,
    })
  ).isRequired,
  profesores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      nombre: PropTypes.string.isRequired,
      apellido: PropTypes.string.isRequired,
    })
  ).isRequired,
  turnoExistente: PropTypes.shape({
    id: PropTypes.number,
    idActividad: PropTypes.number,
    idProfesor: PropTypes.number,
    tipoActividad: PropTypes.string,
    fecha: PropTypes.string,
    horarioDesde: PropTypes.string,
    horarioHasta: PropTypes.string,
    cupoMaximo: PropTypes.number,
  }),
  esEdicion: PropTypes.bool.isRequired,
  tituloModal: PropTypes.string.isRequired,
}
