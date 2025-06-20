import { useState, useEffect, useMemo } from "react"
import {
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material"
import SnackbarMensaje from "../utils/SnackbarMensaje"
import Carga from "../carga/Carga"

const TIPOS_USUARIO = [
  { value: "todos_usuarios", label: "Todos los usuarios" },
  { value: "todos_administradores", label: "Todos los administradores" },
  { value: "todos_profesores", label: "Todos los profesores" },
  { value: "todos_alumnos", label: "Todos los alumnos" },
  { value: 1, label: "Administradores" },
  { value: 2, label: "Profesores" },
  { value: 3, label: "Alumnos" },
]

export default function RedactarMensaje({ onClose, mensajeOriginal, modo }) {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
  const usuarioId = useMemo(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        return usuario.id;
      } catch {
        return null;
      }
    }
    return null;
  }, []);
  const [tipoUsuario, setTipoUsuario] = useState('todos_administradores');
  const [destinatarios, setDestinatarios] = useState([])
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")
  const [destinatariosError, setDestinatariosError] = useState(false)
  const [asuntoError, setAsuntoError] = useState(false)
  const [mensajeError, setMensajeError] = useState(false)
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetch("http://localhost:8080/api/usuarios", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch(err => {
        if (err.name !== 'AbortError') setUsuarios([])
      })
      .finally(() => {
        // Solo poner loading en false si NO se abortó
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [userToken])

  // Filtrar usuarios según tipo seleccionado
  const usuariosFiltrados = useMemo(() => {
    if (tipoUsuario === "todos_usuarios") return usuarios
    if (tipoUsuario === "todos_administradores") return usuarios.filter((u) => u.idTipoUsuario === 1)
    if (tipoUsuario === "todos_profesores") return usuarios.filter((u) => u.idTipoUsuario === 2)
    if (tipoUsuario === "todos_alumnos") return usuarios.filter((u) => u.idTipoUsuario === 3)
    if (tipoUsuario) return usuarios.filter((u) => u.idTipoUsuario === tipoUsuario)
    return usuarios
  }, [usuarios, tipoUsuario])

  // Etiqueta para el destinatario según selección
  const destinatarioLabel = useMemo(() => {
    if (tipoUsuario === "todos_usuarios") return "Todos los usuarios"
    if (tipoUsuario === "todos_administradores") return "Todos los administradores"
    if (tipoUsuario === "todos_profesores") return "Todos los profesores"
    if (tipoUsuario === "todos_alumnos") return "Todos los alumnos"
    const tipo = TIPOS_USUARIO.find((t) => t.value === tipoUsuario)
    return tipo ? tipo.label : "Selecciona destinatario"
  }, [tipoUsuario])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let error = false
    let camposRequeridosVacios = 0

    if (
      tipoUsuario !== "todos_usuarios" &&
      tipoUsuario !== "todos_administradores" &&
      tipoUsuario !== "todos_profesores" &&
      tipoUsuario !== "todos_alumnos" &&
      destinatarios.length === 0
    ) {
      setDestinatariosError(true)
      camposRequeridosVacios++
      error = true
    } else {
      setDestinatariosError(false)
    }

    if (!asunto.trim()) {
      setAsuntoError(true)
      camposRequeridosVacios++
      error = true
    } else {
      setAsuntoError(false)
    }
    if (!mensaje.trim()) {
      setMensajeError(true)
      camposRequeridosVacios++
      error = true
    } else {
      setMensajeError(false)
    }
    if (error) {
      if (camposRequeridosVacios > 1) {
        setMensajeSnackbar("Complete los campos del mensaje.")
      } else if (destinatarios.length === 0) {
        setMensajeSnackbar("Debes seleccionar al menos un destinatario.")
      } else if (!asunto.trim()) {
        setMensajeSnackbar("El asunto es obligatorio.")
      } else if (!mensaje.trim()) {
        setMensajeSnackbar("El mensaje es obligatorio.")
      }
      setSnackbarSeverity("error")
      setAbrirSnackbar(true)
      return
    }
    setEnviando(true)
    try {
      let destinatariosIds = []
      if (tipoUsuario === "todos_usuarios" || tipoUsuario === "todos_administradores" || tipoUsuario === "todos_profesores" || tipoUsuario === "todos_alumnos") {
        destinatariosIds = usuariosFiltrados.map((u) => u.id)
      } else {
        destinatariosIds = destinatarios.map((d) => d.id)
      }
      for (const destId of destinatariosIds) {
        await fetch("http://localhost:8080/api/mensajes/enviar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            remitente_id: usuarioId, // Usar el ID real del usuario logueado
            destinatario_id: destId,
            asunto,
            mensaje,
          }),
        })
      }
      setMensajeSnackbar("¡Mensaje enviado!")
      setSnackbarSeverity("success")
      setAbrirSnackbar(true)
      setDestinatarios([])
      setAsunto("")
      setMensaje("")
      setTipoUsuario("")
    } catch {
      setMensajeSnackbar("No se pudo enviar el mensaje")
      setSnackbarSeverity("error")
      setAbrirSnackbar(true)
    } finally {
      setEnviando(false)
    }
  }
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return
    setAbrirSnackbar(false)
  }

  // Precargar datos si es responder o reenviar
  useEffect(() => {
    if (mensajeOriginal && modo === "responder") {
      setAsunto(mensajeOriginal.asunto.startsWith("Re:") ? mensajeOriginal.asunto : `Re: ${mensajeOriginal.asunto}`)
      setMensaje(`\n\n--- Mensaje original ---\n${mensajeOriginal.mensaje}`)
      const destinatarioObj = usuarios.find((u) => u.id === mensajeOriginal.remitente_id)
      setDestinatarios(destinatarioObj ? [destinatarioObj] : [])
      setTipoUsuario("")
    } else if (mensajeOriginal && modo === "reenviar") {
      setAsunto(mensajeOriginal.asunto.startsWith("Fwd:") ? mensajeOriginal.asunto : `Fwd: ${mensajeOriginal.asunto}`)
      setMensaje(`\n\n--- Mensaje original ---\n${mensajeOriginal.mensaje}`)
      setDestinatarios([])
      setTipoUsuario("")
    }
  }, [mensajeOriginal, modo, usuarios])

  return (
    <>
      <SnackbarMensaje
        abrirSnackbar={abrirSnackbar}
        duracionSnackbar={3000}
        handleCloseSnackbar={handleCloseSnackbar}
        mensajeSnackbar={mensajeSnackbar}
        snackbarSeverity={snackbarSeverity}
      />
      <form onSubmit={handleSubmit} style={{ pointerEvents: enviando ? 'none' : 'auto', opacity: enviando ? 0.6 : 1 }}>
        {loading ? (
          <Carga />
        ) : (
          <>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label='Asunto*'
                type='text'
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required={false}
                fullWidth
                disabled={enviando}
                error={asuntoError}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label='Mensaje*'
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                fullWidth
                multiline
                minRows={4}
                disabled={enviando}
                error={mensajeError}
              />
            </Box>
            <Button
              className='boton-principal'
              type='submit'
              disabled={enviando}
              fullWidth
              sx={{ fontWeight: 500, fontSize: 16, borderRadius: 2, minHeight: 44 }}
              startIcon={enviando ? <CircularProgress size={20} color='inherit' /> : null}
            >
              {enviando ? 'Enviando...' : 'Enviar'}
            </Button>
            {onClose && (
              <Button className='boton-secundario' onClick={onClose} sx={{ mt: 2, width: '100%' }} disabled={enviando}>
                Volver
              </Button>
            )}
          </>
        )}
      </form>
    </>
  )
}
