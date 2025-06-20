import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import DeleteIcon from "@mui/icons-material/Delete"
import { IconButton, Box, Button } from "@mui/material"
import ReplyIcon from "@mui/icons-material/Reply"
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox"
import Carga from "../carga/Carga"

export default function MensajeDetalleAdministrador({ mensaje, onCerrar, usuarios, loading, onEliminar, onResponder, onReenviar }) {

  if (!mensaje) return null

  // Función para capitalizar nombres y apellidos
  const capitalizar = (str) => (str ? str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : "")


  // Función para buscar usuario por id
  const getUsuarioInfo = (id) => {
    const user = usuarios?.find((u) => u.id === id)
    if (!user) return "Usuario desconocido"
    if (user.nombres && user.apellidos) return `${capitalizar(user.nombres)} ${capitalizar(user.apellidos)}`
    if (user.email) return user.email
    return user.id
  }

  return (
    <div className="detalle-mensaje">
      {loading ? (
        <Carga />
      ) : (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <IconButton onClick={onCerrar} aria-label="Volver" size="large">
              <ArrowBackIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              onClick={() => onEliminar && onEliminar(mensaje)}
              aria-label="Eliminar"
              size="large"
              color="default"
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <Button
              variant="text"
              startIcon={<ReplyIcon />}
              onClick={() => onResponder && onResponder(mensaje)}
              sx={{ color: "black", textTransform: "none", fontWeight: 500, ml: 1 }}
            >
              Responder
            </Button>
            <Button
              variant="text"
              startIcon={<ForwardToInboxIcon />}
              onClick={() => onReenviar && onReenviar(mensaje)}
              sx={{ color: "black", textTransform: "none", fontWeight: 500, ml: 1 }}
            >
              Reenviar
            </Button>
            <Box sx={{ flex: 1 }} />
          </Box>
          <h4>{mensaje.asunto}</h4>
          <p>
            <b>De:</b> {getUsuarioInfo(mensaje.remitente_id)}
            <br />
            <b>Para:</b> {getUsuarioInfo(mensaje.destinatario_id)}
            <br />
            <b>Fecha:</b> {mensaje.fecha_envio}
          </p>
          <hr />
          <div style={{ whiteSpace: "pre-line" }}>{mensaje.mensaje}</div>
        </>)}
    </div>
  )
}
