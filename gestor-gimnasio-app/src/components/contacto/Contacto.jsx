import { useEffect, useState } from 'react'
import { Box, Typography, TextField, Button, Paper, Container, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Footer from '../layouts/footer/Footer'
import SnackbarMensaje from '../utils/SnackbarMensaje'
import environment from '../../environments/environment'

function Contacto({ onClose }) {
  const usuarioEstaLogueado = localStorage.getItem('usuarioAccesToken') !== null
  const [formulario, setFormulario] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    asunto: '',
    mensaje: '',
    rol: ''
  })
  const [abrirSnackbar, setAbrirSnackbar] = useState(false)
  const [mensajeSnackbar, setMensajeSnackbar] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('info')
  const [enviando, setEnviando] = useState(false)
  const [asuntoError, setAsuntoError] = useState(false)
  const [mensajeError, setMensajeError] = useState(false)
  const [emailError, setEmailError] = useState(false)



  useEffect(() => {
    if (usuarioEstaLogueado) {
      const usuario = JSON.parse(localStorage.getItem('usuario'))
      setFormulario({
        nombres: usuario.nombres || '',
        apellidos: usuario.apellidos || '',
        email: usuario.email || '',
        asunto: '',
        mensaje: '',
        rol: usuario.descTipoUsuario
      })
    } else {
      setFormulario({
        nombres: '',
        apellidos: '',
        email: '',
        asunto: '',
        mensaje: '',
        rol: 'no está logueado',
      })
    }
  }, [usuarioEstaLogueado])

  const validarEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const camposCargados = formulario.nombres && formulario.apellidos && formulario.email && validarEmail(formulario.email) && formulario.asunto && formulario.mensaje
  const deshabilitarBotonEnviar = !camposCargados || enviando
  const navigate = useNavigate()

  const showSnackbar = (mensaje, severidad) => {
    setMensajeSnackbar(mensaje)
    setSnackbarSeverity(severidad)
    setAbrirSnackbar(true)
  }

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setAbrirSnackbar(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    let error = false

    if (!usuarioEstaLogueado && !formulario.email.trim()) {
      setEmailError(true)
      error = true
    } else if (!usuarioEstaLogueado && !validarEmail(formulario.email.trim())) {
      setEmailError(true)
      setMensajeSnackbar('Ingresá un email válido.')
      setSnackbarSeverity('error')
      setAbrirSnackbar(true)
      error = true
    } else {
      setEmailError(false)
    }

    if (!formulario.nombres.trim()) {
      setMensajeSnackbar('El nombre es obligatorio.')
      setSnackbarSeverity('error')
      setAbrirSnackbar(true)
      error = true
    }
    if (!formulario.apellidos.trim()) {
      setMensajeSnackbar('El apellido es obligatorio.')
      setSnackbarSeverity('error')
      setAbrirSnackbar(true)
      error = true
    }
    if (!formulario.asunto.trim()) {
      setAsuntoError(true)
      error = true
    } else {
      setAsuntoError(false)
    }

    if (!formulario.mensaje.trim()) {
      setMensajeError(true)
      error = true
    } else {
      setMensajeError(false)
    }

    if (error) {
      return
    }

    setEnviando(true)
    try {
      const usuario = usuarioEstaLogueado ? JSON.parse(localStorage.getItem('usuario')) : null
      const emailToSend = usuarioEstaLogueado ? usuario.email : formulario.email
      const rolToSend = usuarioEstaLogueado ? usuario.descTipoUsuario : 'no está logueado'
      const nombresToSend = usuarioEstaLogueado ? usuario.nombres : formulario.nombres
      const apellidosToSend = usuarioEstaLogueado ? usuario.apellidos : formulario.apellidos
      const mensajeToSend = formulario.mensaje
      const emailJson = JSON.stringify({
        email: emailToSend.trim(),
        nombres: nombresToSend.trim(),
        apellidos: apellidosToSend.trim(),
        asunto: formulario.asunto.trim(),
        mensaje: mensajeToSend,
        rol: rolToSend
      })

      const response = await fetch(`${environment.apiUrl}/contactos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: emailJson,
      })

      if (!response.ok) {
        const errorData = await response.json()
        setMensajeSnackbar(errorData.message || 'Error al enviar el mensaje')
        setSnackbarSeverity('error')
        setAbrirSnackbar(true)
        setEnviando(false)
        return
      }

      setMensajeSnackbar('Mensaje enviado exitosamente')
      setSnackbarSeverity('success')
      setAbrirSnackbar(true)
      setFormulario({
        email: usuarioEstaLogueado ? usuario.email : '',
        nombres: usuarioEstaLogueado ? usuario.nombres : '',
        apellidos: usuarioEstaLogueado ? usuario.apellidos : '',
        rol: usuarioEstaLogueado ? usuario.descTipoUsuario : 'no está logueado',
        asunto: '',
        mensaje: ''
      })
    } catch (error) {
      setMensajeSnackbar(error.message || 'Error de conexión al enviar el mensaje')
      setSnackbarSeverity('error')
      setAbrirSnackbar(true)
    } finally {
      setEnviando(false)
    }
  }

  const handleVolver = () => {
    if (onClose) {
      onClose()
    } else {
      navigate(-1)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        overflow: 'hidden'
      }}
    >
      <Box
        component={'main'}
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 2 }
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 5 },
              borderRadius: 2,
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: { xs: 2, sm: 3, md: 4 },
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'left'
              }}
            >
              Envía tu mensaje a Fit Manager
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              {!usuarioEstaLogueado && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <TextField
                      fullWidth
                      required
                      label="Nombre"
                      type='nombre'
                      placeholder='Ingresa tu nombre'
                      value={formulario.nombres}
                      onChange={(e) => setFormulario({ ...formulario, nombres: e.target.value })}
                      variant="outlined"
                      sx={{
                        mb: { xs: 1, sm: 1.5, md: 2 },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#cccccc',
                          },
                          '&:hover fieldset': {
                            borderColor: '#999999',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      required
                      label="Apellido"
                      type='apellido'
                      placeholder='Ingresa tu apellido'
                      value={formulario.apellidos}
                      onChange={(e) => setFormulario({ ...formulario, apellidos: e.target.value })}
                      variant="outlined"
                      sx={{
                        mb: { xs: 1, sm: 1.5, md: 2 },
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          '& fieldset': {
                            borderColor: '#cccccc',
                          },
                          '&:hover fieldset': {
                            borderColor: '#999999',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#1976d2',
                          },
                        },
                      }} s
                    />


                  </Box>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    type='email'
                    placeholder='Ingresa tu email, ejemplo: miemail@email.com'
                    value={formulario.email}
                    onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                    variant="outlined"
                    sx={{
                      mb: { xs: 1, sm: 1.5, md: 2 },
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': {
                          borderColor: '#cccccc',
                        },
                        '&:hover fieldset': {
                          borderColor: '#999999',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#1976d2',
                        },
                      },
                    }}
                    error={emailError}
                  />
                </>
              )}
              <TextField
                fullWidth
                required label="Asunto"
                type='text'
                value={formulario.asunto} onChange={(e) => setFormulario({ ...formulario, asunto: e.target.value })}
                variant="outlined"
                sx={{
                  mb: { xs: 1, sm: 1.5, md: 2 },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#cccccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999999',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
                error={asuntoError}
              />
              <TextField
                fullWidth
                label="Mensaje"
                type='text'
                required multiline
                rows={{ xs: 4, sm: 6, md: 8 }}
                value={formulario.mensaje} onChange={(e) => setFormulario({ ...formulario, mensaje: e.target.value })}
                variant="outlined"
                sx={{
                  mb: { xs: 2, sm: 2.5, md: 3 },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#cccccc',
                    },
                    '&:hover fieldset': {
                      borderColor: '#999999',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                }}
                error={mensajeError}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={deshabilitarBotonEnviar}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 1,
                  mb: { xs: 1.5, sm: 2 },
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                  '&:disabled': {
                    backgroundColor: '#666666',
                    color: '#ffffff',
                  },
                }}
                startIcon={enviando ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {enviando ? 'Enviando...' : 'Enviar'}
              </Button>
              <Button
                fullWidth
                variant='contained'
                onClick={handleVolver}
                sx={{
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 1,
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#333333',
                  },
                }}
                disabled={enviando}
              >
                Volver
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
      <SnackbarMensaje
        abrirSnackbar={abrirSnackbar}
        duracionSnackbar={5000}
        handleCloseSnackbar={handleCloseSnackbar}
        mensajeSnackbar={mensajeSnackbar}
        snackbarSeverity={snackbarSeverity}
      />
    </Box >
  )
}

export default Contacto
