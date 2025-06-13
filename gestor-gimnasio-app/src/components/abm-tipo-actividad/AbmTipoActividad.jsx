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
import SnackbarMensaje from "../utils/SnackbarMensaje"
import { useCallback, useEffect, useMemo, useState } from "react"
import Carga from "../carga/Carga"
import PropTypes from "prop-types"
import environment from "../../environments/environment"
import "./AbmTipoActividad.css"

export default function AbmTipoActividad() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])

  const [tiposActividad, setTiposActividad] = useState([])
  const [salas, setSalas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [cargandoSalas, setCargandoSalas] = useState(true)
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  const [modalConfig, setModalConfig] = useState({
    abrir: false,
    esEdicion: false,
    actividad: null,
    titulo: "",
  })

  const handleOpenModalCrear = () => {
    setModalConfig({
      abrir: true,
      esEdicion: false,
      actividad: null,
      titulo: "Crear nuevo tipo de actividad",
    })
  }

  const handleOpenModalEditar = (actividadParaEditar) => {
    setModalConfig({
      abrir: true,
      esEdicion: true,
      actividad: actividadParaEditar,
      titulo: "Modificar tipo de actividad",
    })
  }

  const handleCloseModal = () => {
    setModalConfig({
      abrir: false,
      esEdicion: false,
      actividad: null,
      titulo: "",
    })
  }

  const handleConfirmarModal = async (datosActividad) => {
    handleCloseModal()
    if (modalConfig.esEdicion) {
      await updateTipoActividad(datosActividad, userToken)
    } else {
      await createTipoActividad(datosActividad, userToken)
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

  const getTiposActividad = useCallback(
    async (token) => {
      setTiposActividad([])
      setCargando(true)

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
          throw new Error("Error al obtener los tipos de actividad")
        }

        const data = await response.json()
        setTiposActividad(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener los tipos de actividad", "error")
        setTiposActividad([])
      } finally {
        setCargando(false)
      }
    },
    [showSnackbar]
  )

  const createTipoActividad = async (nuevaActividad, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/tipos-actividad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaActividad),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al crear el tipo de actividad")
      }

      showSnackbar("Tipo de actividad creado exitosamente", "success")
      await getTiposActividad(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al crear el tipo de actividad", "error")
      setCargando(false)
    }
  }
  const updateTipoActividad = async (actividadActualizada, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/tipos-actividad/${actividadActualizada.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(actividadActualizada),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al modificar el tipo de actividad")
      }

      showSnackbar("Tipo de actividad modificado exitosamente", "success")
      await getTiposActividad(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al modificar el tipo de actividad", "error")
      setCargando(false)
    }
  }

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

  useEffect(() => {
    getTiposActividad(userToken)
    getSalas(userToken)
  }, [userToken, getTiposActividad, getSalas])

  const deleteActividad = async (actividadEliminada, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/tipos-actividad/${actividadEliminada.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al eliminar la actividad")
      }

      showSnackbar("Actividad eliminado exitosamente", "success")
      await getTiposActividad(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al eliminar la actividad", "error")
      setCargando(false)
    }
  }

  return (
    <>
      <h2 className="titulo-clases">ABM Actividades</h2>
      <TableContainer component={Paper} className="equipamiento-table">
        {cargando ? (
          <Carga />
        ) : (
          <TiposActividadTabla
            actividades={tiposActividad}
            onEditar={handleOpenModalEditar}
            salas={salas}
            onEliminar={(actividad) => deleteActividad(actividad, userToken)}
          />
        )}
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="outlined" className="boton-principal" disabled={cargandoSalas} onClick={handleOpenModalCrear}>
          Nueva Actividad
        </Button>
        <Button
          variant="outlined"
          className="boton-principal"
          sx={{ ml: 2 }}
          onClick={() => getTiposActividad(userToken)}
        >
          Actualizar
        </Button>
      </Box>
      <TipoActividadModal
        abrirModal={modalConfig.abrir}
        handleCerrar={handleCloseModal}
        handleConfirmar={handleConfirmarModal}
        actividadExistente={modalConfig.actividad}
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
    </>
  )
}

function TiposActividadTabla({ actividades, onEditar, onEliminar }) {
  const encabezadosTabla = () => {
    return (
      <TableHead className="cabecera-tabla-abm">
        <TableRow>
          <TableCell>ACTIVIDAD</TableCell>
          <TableCell>SALA</TableCell>
          <TableCell>MODIFICAR</TableCell>
          <TableCell>ELIMINAR</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  if (!actividades || actividades.length === 0) {
    return (
      <Table aria-label="tabla de abm tipos actividad">
        {encabezadosTabla()}
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} align="center">
              No hay tipos de actividad para mostrar
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <Table aria-label="tabla de abm tipos actividad">
      {encabezadosTabla()}
      <TableBody>
        {actividades.map((tipoActividad) => (
          <TableRow key={tipoActividad.id}>
            <TableCell>
              {tipoActividad.tipo.charAt(0).toUpperCase() + tipoActividad.tipo.slice(1).toLowerCase()}
            </TableCell>
            <TableCell>
              {tipoActividad.descripcionSala.charAt(0).toUpperCase() +
                tipoActividad.descripcionSala.slice(1).toLowerCase()}
            </TableCell>
            <TableCell>
              <Button variant="outlined" className="boton-principal" onClick={() => onEditar(tipoActividad)}>
                Modificar
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="outlined" className="boton-principal" onClick={() => onEliminar(tipoActividad)}>
                Eliminar
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

TiposActividadTabla.propTypes = {
  actividades: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      tipo: PropTypes.string.isRequired,
      idSala: PropTypes.number,
      descripcionSala: PropTypes.string,
    })
  ).isRequired,
  onEditar: PropTypes.func.isRequired,
}

function TipoActividadModal({
  abrirModal,
  handleCerrar,
  handleConfirmar,
  actividadExistente,
  esEdicion,
  tituloModal,
  salas,
  cargandoSalas,
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

  const [tipo, setTipo] = useState("")
  const [idSala, setIdSala] = useState("")
  const [idActividad, setIdActividad] = useState(null)

  const disabledConfirmButton = !tipo.trim() || !idSala

  const resetFormValues = () => {
    setTipo("")
    setIdSala("")
    setIdActividad(null)
  }

  const handleSubmit = () => {
    const actividadDatos = {
      tipo: tipo.trim(),
      id_sala: parseInt(idSala),
    }
    if (esEdicion && idActividad) {
      actividadDatos.id = idActividad
    }
    handleConfirmar(actividadDatos)
  }

  useEffect(() => {
    if (abrirModal && esEdicion && actividadExistente) {
      setTipo(actividadExistente.tipo ?? "")
      setIdSala(actividadExistente.idSala ? actividadExistente.idSala.toString() : "")
      setIdActividad(actividadExistente.id ?? null)
    } else {
      resetFormValues()
    }
  }, [abrirModal, esEdicion, actividadExistente])

  const handleTipoChange = (event) => {
    const value = event.target.value
    if (value.length <= 50) {
      setTipo(value)
    }
  }

  const handleSalaChange = (event) => {
    setIdSala(event.target.value)
  }

  return (
    <Modal
      open={abrirModal}
      onClose={handleCerrar}
      aria-labelledby="modal-crear-tipo-actividad-title"
      aria-describedby="modal-crear-tipo-actividad-description"
    >
      <Box sx={styleModal}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, color: "black", textAlign: "center" }}>
          {tituloModal}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Tipo de Actividad"
          type="text"
          value={tipo}
          onChange={handleTipoChange}
          placeholder="Ej: Yoga, Pilates, Spinning..."
          slotProps={{
            htmlInput: {
              maxLength: 50,
            },
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="sala-select-label">Sala</InputLabel>
          <Select
            labelId="sala-select-label"
            id="sala-select"
            value={idSala}
            label="Sala"
            onChange={handleSalaChange}
            disabled={cargandoSalas}
          >
            {cargandoSalas ? (
              <MenuItem disabled>Cargando salas...</MenuItem>
            ) : (
              salas.map((sala) => (
                <MenuItem key={sala.id} value={sala.id.toString()}>
                  {sala.descripcion}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 1 }}>
          <Button variant="outlined" className="boton-secundario" onClick={handleCerrar}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            className="boton-principal"
            onClick={handleSubmit}
            disabled={disabledConfirmButton}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

TipoActividadModal.propTypes = {
  abrirModal: PropTypes.bool.isRequired,
  handleCerrar: PropTypes.func.isRequired,
  handleConfirmar: PropTypes.func.isRequired,
  actividadExistente: PropTypes.shape({
    id: PropTypes.number,
    tipo: PropTypes.string,
    idSala: PropTypes.number,
    descripcionSala: PropTypes.string,
  }),
  esEdicion: PropTypes.bool.isRequired,
  tituloModal: PropTypes.string.isRequired,
  salas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      descripcion: PropTypes.string.isRequired,
    })
  ).isRequired,
  cargandoSalas: PropTypes.bool.isRequired,
}
