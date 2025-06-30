import { useCallback, useEffect, useMemo, useState } from "react";
import "./AdministrarPagos.css";
import { Box, Card, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import environment from "../../environments/environment";
import SnackbarMensaje from "../utils/SnackbarMensaje";

export function AdministrarPagos() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), []);
  const [pagosForm, setPagosForm] = useState({
    idUsuario: undefined,
    idTipoPago: undefined,
    monto: undefined,
  });
  const [camposTocados, setCamposTocados] = useState({
    idUsuario: false,
    idTipoPago: false,
    monto: false,
  });

  const [usuarios, setUsuarios] = useState([]);

  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

  const [abrirSnackbar, setAbrirSnackbar] = useState(false);
  const [mensajeSnackbar, setMensajeSnackbar] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showSnackbar = useCallback((mensaje, severidad) => {
    setMensajeSnackbar(mensaje);
    setSnackbarSeverity(severidad);
    setAbrirSnackbar(true);
  }, []);

  const handleCloseSnackbar = useCallback((_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAbrirSnackbar(false);
  }, []);

  const fetchUsuarios = useCallback(async (token) => {
    setCargandoUsuarios(true);
    try {
      const response = await fetch(`${environment.apiUrl}/usuarios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data = await response.json();
      setUsuarios(data);
      console.log("Usuarios obtenidos:", data);
    } catch (error) {
      showSnackbar(error.message ?? "Error al obtener los usuarios", "error");
      setUsuarios([]);
    } finally {
      setCargandoUsuarios(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchUsuarios(userToken);
  }, [fetchUsuarios]);

  useEffect(() => {
    fetchUsuarios(userToken);
  }, [fetchUsuarios]);

  return (
    <>
      <h2 className="titulo">Administrar Pagos</h2>
      <Card sx={{ padding: 3, minWidth: "70%", margin: "auto", display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <Box sx={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <FormControl fullWidth margin="normal" required error={!pagosForm.idUsuario && camposTocados.idUsuario}>
            <InputLabel id="usuario-label">Usuario</InputLabel>
            <Select
              labelId="usuario-label"
              id="usuario-select"
              value={pagosForm.idUsuario ?? ""}
              label="Usuario"
              onChange={(e) => setPagosForm({ ...pagosForm, idUsuario: e.target.value })}
              onBlur={() => setCamposTocados({ ...camposTocados, idUsuario: true })}
              disabled={cargandoUsuarios}
            >
              <MenuItem value="">
                <em>Seleccione un usuario</em>
              </MenuItem>
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {`${usuario.nombres} ${usuario.apellidos}`}
                </MenuItem>
              ))}
            </Select>
            {!pagosForm.idUsuario && camposTocados.idUsuario && (
              <FormHelperText>Por favor, seleccione un usuario</FormHelperText>
            )}
          </FormControl>
        </Box>
      </Card>
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

export default AdministrarPagos;
