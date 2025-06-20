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

export default function Actividades() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])

  const [tiposActividad, setTiposActividad] = useState([])
  const [cargando, setCargando] = useState(true)
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")

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

  useEffect(() => {
    getTiposActividad(userToken)
  }, [userToken, getTiposActividad])

  return (
    <>
      <h2 className="titulo-clases">Actividades</h2>
      <TableContainer component={Paper} className="equipamiento-table"  sx={{
    border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
    boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)'
  }}>
        {cargando ? <Carga /> : <TiposActividadTabla actividades={tiposActividad} />}
      </TableContainer>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          variant="outlined"
          className="boton-principal"
          sx={{ ml: 2 }}
          onClick={() => getTiposActividad(userToken)}
        >
          Actualizar
        </Button>
      </Box>
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

function TiposActividadTabla({ actividades }) {
  const encabezadosTabla = () => {
    return (
      <TableHead className="cabecera-tabla-abm">
        <TableRow>
          <TableCell>ACTIVIDAD</TableCell>
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
