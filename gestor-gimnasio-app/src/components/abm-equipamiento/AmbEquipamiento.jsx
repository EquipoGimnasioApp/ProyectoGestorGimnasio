import { useMemo, useCallback, useEffect, useState } from "react"
import environment from "../../environments/environment"
import Carga from "../carga/Carga"

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
import "./AmbEquipamiento.css"

export default function AbmEquipamiento() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
  const [equipamiento, setEquipamiento] = useState([])
  const [cargando, setCargando] = useState(true)

  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

  const [modalConfig, setModalConfig] = useState({
    abrir: false,
    esEdicion: false,
    material: null,
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

  const getEquipamiento = useCallback(
    async (token) => {
      setEquipamiento([])
      setCargando(true)

      try {
        const response = await fetch(`${environment.apiUrl}/equipamiento`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los materiales")
        }

        const data = await response.json()
        setEquipamiento(data)
      } catch (error) {
        showSnackbar(error.message ?? "Error al obtener los materiales", "error")
        setEquipamiento([])
      } finally {
        setCargando(false)
      }
    },
    [showSnackbar]
  )

  useEffect(() => {
    getEquipamiento(userToken)
  }, [userToken, getEquipamiento])

  const handleOpenModalCrear = () => {
    setModalConfig({
      abrir: true,
      esEdicion: false,
      material: null,
      titulo: "Crear un nuevo material",
    })
  }

  const handleOpenModalEditar = (materialParaEditar) => {
    setModalConfig({
      abrir: true,
      esEdicion: true,
      material: materialParaEditar,
      titulo: "Modificar material",
    })
  }

  const handleCloseModal = () => {
    setModalConfig({
      abrir: false,
      esEdicion: false,
      material: null,
      titulo: "",
    })
  }

  const handleConfirmarModal = async (datosMaterial) => {
    handleCloseModal()
    if (modalConfig.esEdicion) {
      await updateMaterial(datosMaterial, userToken)
    } else {
      await createMaterial(datosMaterial, userToken)
    }
  }

  const createMaterial = async (nuevoMaterial, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/equipamiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          descripcion: nuevoMaterial.descripcion.toLocaleUpperCase("es-AR"),
          stock: nuevoMaterial.stock ? Number(nuevoMaterial.stock) : 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al crear el material")
      }

      showSnackbar("Material creado exitosamente", "success")
      await getEquipamiento(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al crear el material", "error")
    } finally {
      setCargando(false)
    }
  }

  const updateMaterial = async (materialActualizado, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/equipamiento/${materialActualizado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...materialActualizado,
          descripcion: materialActualizado.descripcion.toLocaleUpperCase("es-AR"),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al modificar el material")
      }

      showSnackbar("Material modificado exitosamente", "success")
      await getEquipamiento(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al modificar el material", "error")
      setCargando(false)
    }
  }

  const deleteMaterial = async (materialEliminado, token) => {
    setCargando(true)
    try {
      const response = await fetch(`${environment.apiUrl}/equipamiento/${materialEliminado.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message ?? "Error al eliminar el material")
      }

      showSnackbar("Material eliminado exitosamente", "success")
      await getEquipamiento(token)
    } catch (error) {
      showSnackbar(error.message ?? "Error al eliminar el material", "error")
      setCargando(false)
    }
  }

  return (
    <>
      <h2 className="titulo-clases">ABM Equipamiento</h2>
      <TableContainer component={Paper} className="equipamiento-table" sx={{ border: 'rgba(60, 60, 60, 0.22) 0.5px solid', boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)' }}>
        {cargando ? (
          <Carga />
        ) : (
          <EquipamientoTabla
            equipamiento={equipamiento}
            onEditar={handleOpenModalEditar}
            onEliminar={(material) => deleteMaterial(material, userToken)}
          />
        )}
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
        {
          <Button variant="outlined" className="boton-principal" disabled={cargando} onClick={handleOpenModalCrear}>
            Nuevo material
          </Button>
        }
        <Button
          variant="outlined"
          disabled={cargando}
          className="boton-principal"
          sx={{ ml: 2 }}
          onClick={() => getEquipamiento(userToken)}
        >
          Actualizar
        </Button>
      </Box>
      {
        <EquipamientoModal
          abrirModal={modalConfig.abrir}
          handleCerrar={handleCloseModal}
          handleConfirmar={handleConfirmarModal}
          materialExistente={modalConfig.material}
          esEdicion={modalConfig.esEdicion}
          tituloModal={modalConfig.titulo}
        />
      }
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

function EquipamientoTabla({ equipamiento, onEditar, onEliminar }) {
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
          <TableCell>MATERIAL</TableCell>
          <TableCell>CANTIDAD</TableCell>
          <TableCell>MODIFICAR</TableCell>
          <TableCell>ELIMINAR</TableCell>
        </TableRow>
      </TableHead>
    )
  }

  if (!equipamiento || equipamiento.length === 0) {
    return (
      <Table sx={{ minWidth: 600 }} aria-label="tabla de abm equipamiento">
        {encabezadosTabla()}
        <TableBody>
          <TableRow>
            <TableCell colSpan={4} align="center">
              No hay materiales para mostrar
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  return (
    <>
      <Table sx={{ minWidth: 600 }} aria-label="tabla de abm equipamiento">
        {encabezadosTabla()}
        <TableBody>
          {equipamiento.map((material) => (
            <TableRow key={material.id}>
              <TableCell>
                {material.descripcion.charAt(0).toUpperCase() + material.descripcion.slice(1).toLowerCase()}
              </TableCell>
              <TableCell>{material.stock}</TableCell>
              <TableCell>
                <Button variant="outlined" className="boton-principal" onClick={() => onEditar(material)}>
                  Modificar
                </Button>
              </TableCell>
              <TableCell>
                <Button variant="outlined" className="boton-principal" onClick={() => handleClickEliminar(material)}>
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
          <Typography sx={{ mb: 3 }}>¿Está seguro de que desea eliminar el material?</Typography>
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

function EquipamientoModal({ abrirModal, handleCerrar, handleConfirmar, materialExistente, esEdicion, tituloModal }) {
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

  const [material, setMaterial] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [idMaterial, setIdMaterial] = useState(null)

  const disabledConfirmButton = !material.trim() || !cantidad.trim() || isNaN(Number(cantidad))

  const resetFormValues = () => {
    setMaterial("")
    setCantidad("")
    setIdMaterial(null)
  }

  const handleSubmit = () => {
    const materialDatos = {
      descripcion: material.trim(),
      stock: Number(cantidad),
    }
    if (esEdicion && idMaterial) {
      materialDatos.id = idMaterial
    }
    handleConfirmar(materialDatos)
  }

  useEffect(() => {
    if (abrirModal && esEdicion && materialExistente) {
      setMaterial(materialExistente.descripcion ?? "")
      setCantidad(materialExistente.stock?.toString() ?? "")
      setIdMaterial(materialExistente.id ?? null)
    } else {
      resetFormValues()
    }
  }, [abrirModal, esEdicion, materialExistente])

  const handleMaterialChange = (event) => {
    const value = event.target.value
    if (value.length <= 50) {
      setMaterial(value)
    }
  }

  const handleCantidadChange = (event) => {
    const value = event.target.value
    if (/^\d{0,6}$/.test(value)) {
      setCantidad(value)
    }
  }

  return (
    <Modal
      open={abrirModal}
      onClose={handleCerrar}
      aria-labelledby="modal-crear-material-title"
      aria-describedby="modal-crear-material-description"
    >
      <Box sx={styleModal}>
        <Typography variant="h6" component="h2" sx={{ mb: 2, color: "black", textAlign: "center" }}>
          {tituloModal}
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Material"
          type="text"
          value={material}
          onChange={handleMaterialChange}
          placeholder="Ingrese el nombre del material"
          slotProps={{
            htmlInDELETE: {
              maxLength: 50,
            },
          }}
        />

        <TextField
          fullWidth
          margin="normal"
          label="Cantidad"
          type="number"
          value={cantidad}
          onChange={handleCantidadChange}
          placeholder="Ingrese la cantidad que tiene del material"
          inputProps={{ min: 0, max: 999999 }}
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
