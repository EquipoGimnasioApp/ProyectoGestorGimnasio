import { useCallback, useEffect, useMemo, useState } from "react";
import "./AdministrarPagos.css";
import { Box, Button, Card, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import environment from "../../environments/environment";
import SnackbarMensaje from "../utils/SnackbarMensaje";

export function AdministrarPagos() {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), []);
  const [pagosForm, setPagosForm] = useState({
    idUsuario: undefined,
    idFormaPago: undefined,
    monto: undefined,
  });
  const [camposTocados, setCamposTocados] = useState({
    idUsuario: false,
    idFormaPago: false,
    monto: false,
  });

  const todosLosCamposTocados = useMemo(() => Object.values(camposTocados).every((tocado) => tocado), [camposTocados]);

  const [usuarios, setUsuarios] = useState([]);
  const [formasPago, setFormasPago] = useState([]);

  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [cargandoFormasPago, setCargandoFormasPago] = useState(false);
  const [cargando, setCargando] = useState(false);

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

  const handleSubmit = useCallback(async () => {
    if (!pagosForm.idUsuario || !pagosForm.idFormaPago || !pagosForm.monto) {
      showSnackbar("Por favor, complete todos los campos requeridos", "error");
      setCamposTocados({
        idUsuario: !pagosForm.idUsuario,
        idFormaPago: !pagosForm.idFormaPago,
        monto: !pagosForm.monto,
      });
      return;
    }

    setCargando(true);
    try {
      const response = await fetch(`${environment.apiUrl}/pagos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(pagosForm),
      });

      if (!response.ok) {
        throw new Error("Error al registrar el pago");
      }

      const data = await response.json();
      showSnackbar(data.message ?? "Pago registrado exitosamente", "success");
      setPagosForm({ idUsuario: undefined, idFormaPago: undefined, monto: undefined });
      setCamposTocados({ idUsuario: false, idFormaPago: false, monto: false });
    } catch (error) {
      showSnackbar(error.message ?? "Error al registrar el pago", "error");
    } finally {
      setCargando(false);
    }
  }, [pagosForm, showSnackbar]);

  const validarNumero = useCallback((e) => {
    const valor = e.target.value;
    if (valor === '') {
      setPagosForm({ ...pagosForm, monto: valor });
      return;
    }

    const numeroRegex = /^\d*\.?\d*$/;

    if (numeroRegex.test(valor)) {
      const numeroValor = parseFloat(valor);
      if (!isNaN(numeroValor) && numeroValor >= 0) {
        setPagosForm({ ...pagosForm, monto: valor });
      }
    }
  }, [pagosForm]);

  const permitirSoloNumeros = useCallback((e) => {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isNumber = /\d/.test(e.key);
    const isDecimal = e.key === '.' && !e.target.value.includes('.');

    if (!allowedKeys.includes(e.key) && !isNumber && !isDecimal) {
      e.preventDefault();
    }
  }, [pagosForm]);

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

  const fetchFormasPago = useCallback(async (token) => {
    setCargandoFormasPago(true);
    try {
      const response = await fetch(`${environment.apiUrl}/formas-pago`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al obtener las formas de pago");
      }

      const data = await response.json();
      setFormasPago(data);
    } catch (error) {
      showSnackbar(error.message ?? "Error al obtener las formas de pago", "error");
      setFormasPago([]);
    } finally {
      setCargandoFormasPago(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchUsuarios(userToken);
    fetchFormasPago(userToken);
  }, [fetchUsuarios, fetchFormasPago]);

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
              disabled={cargando || cargandoUsuarios}
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
          <FormControl fullWidth margin="normal" required error={!pagosForm.idFormaPago && camposTocados.idFormaPago}>
            <InputLabel id="forma-pago-label">Forma de Pago</InputLabel>
            <Select
              labelId="forma-pago-label"
              id="forma-pago-select"
              value={pagosForm.idFormaPago ?? ""}
              label="Forma de Pago"
              onChange={(e) => setPagosForm({ ...pagosForm, idFormaPago: e.target.value })}
              onBlur={() => setCamposTocados({ ...camposTocados, idFormaPago: true })}
              disabled={cargando || cargandoFormasPago}
            >
              <MenuItem value="">
                <em>Seleccione una forma de pago</em>
              </MenuItem>
              {formasPago.map((forma) => (
                <MenuItem key={forma.id} value={forma.id}>
                  {forma.descripcion.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
            {!pagosForm.idFormaPago && camposTocados.idFormaPago && (
              <FormHelperText>Por favor, seleccione una forma de pago</FormHelperText>
            )}
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Monto"
            type="number"
            required
            slotProps={{
              htmlInput: {
                min: 0,
                step: "any",
              }
            }}
            value={pagosForm.monto ?? ""}
            onKeyDown={permitirSoloNumeros}
            onChange={validarNumero}
            onBlur={() => setCamposTocados({ ...camposTocados, monto: true })}
            disabled={cargando}
            error={!pagosForm.monto && camposTocados.monto}
            helperText={!pagosForm.monto && camposTocados.monto && "Por favor, ingrese un monto válido"}
          />
          <Button variant="contained" className="boton-principal" sx={{ mt: 2 }} onClick={handleSubmit} disabled={!todosLosCamposTocados || cargando}>
            {cargando ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
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
