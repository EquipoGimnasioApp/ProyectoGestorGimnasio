import React, { useEffect, useState, useMemo } from "react"
import MensajeDetalle from "./MensajeDetalleAdministrador"
import { Box } from "@mui/material"
import SnackbarMensaje from "../utils/SnackbarMensaje"
import RedactarMensajeAdministrador from "./RedactarMensajeAdministrador"
import Carga from "../carga/Carga"

export default function ListaMensajesAdministrador({ tipo, onDetalleOpen, onDetalleClose }) {
  const userToken = useMemo(() => localStorage.getItem("usuarioAccesToken"), [])
  const [mensajes, setMensajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [usuarios, setUsuarios] = useState([])
  const [mensajeSeleccionado, setMensajeSeleccionado] = useState(null)
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("info")
  const [mensajeParaRedactar, setMensajeParaRedactar] = useState(null)
  const [modoRedactar, setModoRedactar] = useState(null) // 'responder' o 'reenviar'

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
}, [])

  // Traer usuarios para mostrar nombre/email
  useEffect(() => {
    fetch("http://localhost:8080/api/usuarios", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch(() => setUsuarios([]))
  }, [userToken])

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController()
    const endpoint =
      tipo === 'recibidos'
        ? `http://localhost:8080/api/mensajes/recibidos/${usuarioId}`
        : `http://localhost:8080/api/mensajes/enviados/${usuarioId}`

    fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => setMensajes(data))
      .catch(err => {
        if (err.name !== 'AbortError') setMensajes([])
      })
      .finally(() => {
        // Solo poner loading en false si NO se abortó
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [tipo, usuarioId, userToken])

  // Función para capitalizar nombres y apellidos
  const capitalizar = (str) => (str ? str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : "")

  // Función para buscar usuario por id
  const getUsuarioInfo = (id) => {
    const user = usuarios.find((u) => u.id === id)
    if (!user) return "Usuario desconocido"
    if (user.nombres && user.apellidos) return `${capitalizar(user.nombres)} ${capitalizar(user.apellidos)}`
    if (user.email) return user.email
    return user.id
  }

  // Marcar como leído al seleccionar un mensaje recibido no leído
  const handleSeleccionarMensaje = async (msg) => {
    setMensajeSeleccionado(msg)
    if (onDetalleOpen) onDetalleOpen()
    if (tipo === "recibidos" && !msg.leido) {
      try {
        await fetch(`http://localhost:8080/api/mensajes/${msg.id}/leido`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        })
        setMensajes((prev) => prev.map((m) => (m.id === msg.id ? { ...m, leido: true } : m)))
      } catch { }
    }
  }

  // Lógica de borrado de mensaje
  const handleEliminarMensaje = async (mensaje) => {
    try {
      setLoading(true)
      await fetch(`http://localhost:8080/api/mensajes/${mensaje.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })
      setMensajes((prev) => prev.filter((m) => m.id !== mensaje.id))
      setMensajeSeleccionado(null)
      setMensajeSnackbar("Mensaje eliminado correctamente")
      setSnackbarSeverity("success")
      setAbrirSnackbar(true)
      if (onDetalleClose) onDetalleClose()
    } catch {
      setMensajeSnackbar("No se pudo eliminar el mensaje. Intenta nuevamente.")
      setSnackbarSeverity("error")
      setAbrirSnackbar(true)
    } finally {
      setLoading(false)
    }
  }
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return
    setAbrirSnackbar(false)
  }

  if (loading) {
    return (
      <Carga />
    )
  }

  if (mensajeSeleccionado) {
    return (
      <>
        <MensajeDetalle
          mensaje={mensajeSeleccionado}
          onCerrar={() => {
            setMensajeSeleccionado(null)
            if (onDetalleClose) onDetalleClose()
          }}
          usuarios={usuarios}
          onEliminar={handleEliminarMensaje}
          onResponder={(msg) => {
            setMensajeParaRedactar(msg)
            setModoRedactar("responder")
            setMensajeSeleccionado(null)
          }}
          onReenviar={(msg) => {
            setMensajeParaRedactar(msg)
            setModoRedactar("reenviar")
            setMensajeSeleccionado(null)
          }}
          loading={loading}
        />
      </>
    )
  }

  if (mensajeParaRedactar) {
    return (
      <RedactarMensajeAdministrador
        onClose={() => {
          setMensajeParaRedactar(null)
          setModoRedactar(null)
          if (onDetalleClose) onDetalleClose()
        }}
        mensajeOriginal={mensajeParaRedactar}
        modo={modoRedactar}
      />
    )
  }

  return (
    <>
      <Box sx={{ mt: 2 }}>
        {mensajes.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", margin: 32 }}>No hay mensajes para mostrar.</div>
        ) : (
          mensajes.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                p: 2,
                mb: 1,
                boxShadow: "0 1px 4px rgba(60,60,60,0.06)",
                cursor: "pointer",
                background: "#fff",
                "&:hover": { background: "#f8fafc" },
              }}
              onClick={() => handleSeleccionarMensaje(msg)}
            >
              <div style={{ flex: 2, fontWeight: 500 }}>
                {getUsuarioInfo(tipo === "recibidos" ? msg.remitente_id : msg.destinatario_id)}
              </div>
              <div style={{ flex: 2 }}>{msg.asunto}</div>
              <div style={{ flex: 4, color: "#666" }}>
                {msg.mensaje ? msg.mensaje.slice(0, 40) + (msg.mensaje.length > 40 ? "..." : "") : ""}
              </div>
              <div style={{ flex: 1, textAlign: "right", color: "#888" }}>
                {msg.fecha_envio
                  ? new Date(msg.fecha_envio).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                  })
                  : ""}
              </div>
            </Box>
          ))
        )}
      </Box>
      <SnackbarMensaje
        abrirSnackbar={abrirSnackbar}
        duracionSnackbar={3000}
        handleCloseSnackbar={handleCloseSnackbar}
        mensajeSnackbar={mensajeSnackbar}
        snackbarSeverity={snackbarSeverity}
      />
    </>
  )
}
