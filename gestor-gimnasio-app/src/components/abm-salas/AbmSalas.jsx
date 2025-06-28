import { useMemo, useCallback, useEffect, useState } from "react"
import environment from "../../environments/environment"
import SnackbarMensaje from "../utils/SnackbarMensaje"
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
} from "@mui/material"
import CargaTabla from "../clases-carga/CargaTabla"

export default function AbmSalas() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
  const [salas, setSalas] = useState([])
  const [cargando, setCargando] = useState(true)

  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  const [modalConfig, setModalConfig] = useState({
    abrir: false,
    esEdicion: false,
    sala: null,
    titulo: "",
  })

  const showSnackbar = useCallback((mensaje, severidad) => {
    setMensajeSnackbar(mensaje)
    setSnackbarSeverity(severidad)
    setAbrirSnackbar(true)
  }, [])
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") {
      return
    }

    setAbrirSnackbar(false)
  }

  const getSalas = useCallback(
    async (token) => {
      setSalas([])
      setCargando(true)

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
        setCargando(false)
      }
    },
    [showSnackbar]
  )

  useEffect(() => {
    getSalas(userToken)
  }, [userToken, getSalas])

  const handleOpenModalCrear = () => {
    setModalConfig({
      abrir: true,
      esEdicion: false,
      sala: null,
      titulo: "Crear nueva sala",
    })
  }

  const handleOpenModalEditar = (salaParaEditar) => {
    setModalConfig({
      abrir: true,
      esEdicion: true,
      sala: salaParaEditar,
      titulo: "Modificar sala",
    })
  }

  const handleCloseModal = () => {
    setModalConfig({
      abrir: false,
      esEdicion: false,
      sala: null,
      titulo: "",
    })
  }

  const handleConfirmarModal = async (datosSala) => {
    handleCloseModal()
    if (modalConfig.esEdicion) {
      await updateSala(datosSala, userToken)
    } else {
      await createSala(datosSala, userToken)
    }
  }

  const createSala = async (nuevaSala, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/salas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion: nuevaSala.descripcion.toLocaleUpperCase("es-AR") }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al crear la sala")
      }

      showSnackbar("Sala creada exitosamente", "success")
      await getSalas(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al crear la sala", "error")
    } finally {
      setCargando(false)
    }
  }

  const updateSala = async (salaActualizada, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/salas/${salaActualizada.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...salaActualizada,
          descripcion: salaActualizada.descripcion.toLocaleUpperCase("es-AR"),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al modificar la sala")
      }

      showSnackbar("Sala modificada exitosamente", "success")
      await getSalas(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al modificar la sala", "error")
      setCargando(false)
    }
  }

  const deleteSala = async (salaEliminada, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/salas/${salaEliminada.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al eliminar la sala")
      }

      showSnackbar("Sala eliminado exitosamente", "success")
      await getSalas(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al eliminar la sala", "error")
      setCargando(false)
    }
  }

  return (
    <>
      <h2 className="titulo-clases">Administrar salas</h2>
      <TableContainer component={Paper} className="equipamiento-table"  sx={{
    border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
    boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)'
  }}>
        {cargando ? (
          <CargaTabla texto="Cargando salas..." />
        ) : (
          <SalasTabla
            salas={salas}
            onEditar={handleOpenModalEditar}
            onEliminar={(sala) => deleteSala(sala, userToken)}
          />
        )}
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button variant="outlined" className="boton-principal" disabled={cargando} onClick={handleOpenModalCrear}>
          Nueva Sala
        </Button>
        <Button
          variant="outlined"
          disabled={cargando}
          className="boton-principal"
          sx={{ ml: 2 }}
          onClick={() => getSalas(userToken)}
        >
          Actualizar
        </Button>
      </Box>
      <SalasModal
        abrirModal={modalConfig.abrir}
        handleCerrar={handleCloseModal}
        handleConfirmar={handleConfirmarModal}
        salaExistente={modalConfig.sala}
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

function SalasTabla({ salas, onEditar, onEliminar }) {
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

  const encabezadosTabla = () => (
    <TableHead className="cabecera-tabla-abm">
      <TableRow>
        <TableCell>SALA</TableCell>
        <TableCell>MODIFICAR</TableCell>
        <TableCell>ELIMINAR</TableCell>
      </TableRow>
    </TableHead>
  )

  if (!salas || salas.length === 0) {
    return (
      <Table aria-label="tabla de abm salas">
        {encabezadosTabla()}
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} align="center">
              No hay salas para mostrar
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

function capitalizarFrase(frase) {
  return typeof frase === 'string'
    ? frase
        .split(' ')
        .map(
          palabra =>
            palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
        )
        .join(' ')
    : '';
}

  return (
    <>
      <Table aria-label="tabla de abm salas" >
        {encabezadosTabla()}
        <TableBody>
          {salas.map((sala) => (
            <TableRow key={sala.id}>
              <TableCell>
                {capitalizarFrase(sala.descripcion)}
              </TableCell>
              <TableCell>
                <Button variant="outlined" className="boton-principal" onClick={() => onEditar(sala)}>
                  Modificar
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="outlined" className="boton-principal" onClick={() => handleClickEliminar(sala)}>
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
          <Typography sx={{ mb: 3 }}>¿Está seguro de que desea eliminar la sala?</Typography>
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
function SalasModal({ abrirModal, handleCerrar, handleConfirmar, salaExistente, esEdicion, tituloModal }) {
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

  const [sala, setSala] = useState("")
  const [idSala, setIdSala] = useState(null)

  const disabledConfirmButton = !sala.trim()

  const resetFormValues = () => {
    setSala("")
    setIdSala(null)
  }

  const handleSubmit = () => {
    const salaDatos = {
      descripcion: sala.trim(),
    }
    if (esEdicion && idSala) {
      salaDatos.id = idSala
    }
    handleConfirmar(salaDatos)
  }

  useEffect(() => {
    if (abrirModal && esEdicion && salaExistente) {
      setSala(salaExistente.descripcion ?? "")
      setIdSala(salaExistente.id ?? null)
    } else {
      resetFormValues()
    }
  }, [abrirModal, esEdicion, salaExistente])

  const handleSalaChange = (event) => {
    const value = event.target.value
    if (value.length <= 50) {
      setSala(value)
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
          label="Sala"
          type="text"
          value={sala}
          onChange={handleSalaChange}
          placeholder="Ingrese el nombre de la sala"
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
