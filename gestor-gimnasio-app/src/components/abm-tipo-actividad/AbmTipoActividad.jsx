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
import CargaTabla from "../clases-carga/CargaTabla"
import PropTypes from "prop-types"
import environment from "../../environments/environment"
import "./AbmTipoActividad.css"

export default function AbmTipoActividad() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])

  const [tiposActividad, setTiposActividad] = useState([])
  const [cargando, setCargando] = useState(true)
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
      titulo: "Crear nueva actividad",
    })
  }

  const handleOpenModalEditar = (actividadParaEditar) => {
    setModalConfig({
      abrir: true,
      esEdicion: true,
      actividad: actividadParaEditar,
      titulo: "Modificar actividad",
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
          throw new Error("Error al obtener las actividades")
        }

        const data = await response.json()
        setTiposActividad(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener las actividades", "error")
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
        throw new Error(errorData.message ?? "Error al crear actividad")
      }

      showSnackbar("Actividad creada exitosamente", "success")
      await getTiposActividad(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al crear actividad", "error")
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
        throw new Error(errorData.message ?? "Error al modificar actividad")
      }

      showSnackbar("Actividad modificada exitosamente", "success")
      await getTiposActividad(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al modificar actividad", "error")
      setCargando(false)
    }
  }

  useEffect(() => {
    getTiposActividad(userToken)

  }, [userToken, getTiposActividad])

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

      showSnackbar("Actividad eliminada exitosamente", "success")
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
          <CargaTabla texto="Cargando actividades..." />
        ) : (
          <TiposActividadTabla
            actividades={tiposActividad}
            onEditar={handleOpenModalEditar}
            onEliminar={(actividad) => deleteActividad(actividad, userToken)}
          />
        )}
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="outlined" className="boton-principal"  disabled={cargando}  onClick={handleOpenModalCrear}>
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
    <>
      <Table aria-label="tabla de abm tipos actividad">
        {encabezadosTabla()}
        <TableBody>
          {actividades.map((tipoActividad) => (
            <TableRow key={tipoActividad.id}>
              <TableCell>
                {tipoActividad.tipo.charAt(0).toUpperCase() + tipoActividad.tipo.slice(1).toLowerCase()}
              </TableCell>
              <TableCell>
                <Button variant="outlined" className="boton-principal" onClick={() => onEditar(tipoActividad)}>
                  Modificar
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  className="boton-principal"
                  onClick={() => handleClickEliminar(tipoActividad)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
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
          <Typography sx={{ mb: 3 }}>¿Está seguro de que desea eliminar la actividad?</Typography>
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

TiposActividadTabla.propTypes = {
  actividades: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      tipo: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func.isRequired,
}

function TipoActividadModal({
  abrirModal,
  handleCerrar,
  handleConfirmar,
  actividadExistente,
  esEdicion,
  tituloModal,
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
  const [idActividad, setIdActividad] = useState(null)

  const disabledConfirmButton = !tipo.trim() 
  const resetFormValues = () => {
    setTipo("")
    setIdActividad(null)
  }

  const handleSubmit = () => {
    const actividadDatos = {
      tipo: tipo.trim(),
    }
    if (esEdicion && idActividad) {
      actividadDatos.id = idActividad
    }
    handleConfirmar(actividadDatos)
  }

  useEffect(() => {
    if (abrirModal && esEdicion && actividadExistente) {
      setTipo(actividadExistente.tipo ?? "")
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
  }),
  esEdicion: PropTypes.bool.isRequired,
  tituloModal: PropTypes.string.isRequired,
}
