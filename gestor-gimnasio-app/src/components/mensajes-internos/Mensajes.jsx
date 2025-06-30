import React, { useState, useEffect } from "react"
import ListaMensajes from "./ListaMensajes"
import RedactarMensaje from "./RedactarMensaje"
import { Box, Tabs, Tab, Button, Paper } from "@mui/material"
import "../abm-equipamiento/AmbEquipamiento.css"

export default function Mensajes() {
  const [vista, setVista] = useState("recibidos")
  const [noLeidos, setNoLeidos] = useState(0)
  const [mostrarRedactar, setMostrarRedactar] = useState(false)
  const [viendoDetalle, setViendoDetalle] = useState(false)

  // Función para saber si se está viendo el detalle de un mensaje
  const handleDetalleOpen = () => setViendoDetalle(true)
  const handleDetalleClose = () => setViendoDetalle(false)

  useEffect(() => {
    const userToken = localStorage.getItem("usuarioAccesToken")
    const usuarioId = (() => {
      const usuarioGuardado = localStorage.getItem('usuario')
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          return usuario.id
        } catch {
          return null
        }
      }
      return null
    })()
    fetch(`http://localhost:8080/api/mensajes/recibidos/${usuarioId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const count = data.filter((msg) => !msg.leido).length
        setNoLeidos(count)
      })
      .catch(() => setNoLeidos(0))
  }, [vista])

  return (
    <>
      <div className='p-6 space-y-6' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            width: '95vw',
            maxWidth: 1600,
            margin: '0 auto',
            padding: { xs: 2, sm: 6, md: 8 },
            border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
            backgroundColor: 'rgba(248, 250, 252, 1)',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(60,60,60,0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <h2 className="titulo-clases">Mensajes</h2>
          <Box
            sx={{
              maxWidth: 1200,
              width: "100%",
              minWidth: 700,
              margin: "40px auto",
              background: "#fff",
              borderRadius: 3,
              border: 'rgba(60, 60, 60, 0.22) 0.5px solid',
              boxShadow: '0 4px 28px rgba(78, 78, 78, 0.12)',
              p: 3,
              minHeight: 400,
              transition: "min-height 0.2s",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              {!mostrarRedactar && !viendoDetalle && (
                <>
                  <Tabs
                    value={vista}
                    onChange={(_, v) => setVista(v)}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{ minHeight: 40 }}
                  >
                    <Tab label="Recibidos" value="recibidos" sx={{ minWidth: 120, fontSize: 18 }} />
                    <Tab label="Enviados" value="enviados" sx={{ minWidth: 120, fontSize: 18 }} />
                  </Tabs>
                  <Button
                    className="boton-principal"
                    onClick={() => setMostrarRedactar(true)}
                    sx={{
                      minWidth: 120,
                      fontWeight: 500,
                      fontSize: 16,
                      borderRadius: 2,
                      boxShadow: "none",
                    }}
                  >
                    Redactar
                  </Button>
                </>
              )}
            </Box>
            <Box sx={{ minHeight: 220 }}>
              {mostrarRedactar ? (
                <RedactarMensaje onClose={() => setMostrarRedactar(false)} />
              ) : (
                <ListaMensajes tipo={vista} onDetalleOpen={handleDetalleOpen} onDetalleClose={handleDetalleClose} />
              )}
            </Box>
          </Box>
        </Paper>
      </div>
    </>
  )
}
