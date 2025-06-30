import { useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import environment from '../../../environments/environment'
import './Register.css'
import Footer from '../../layouts/footer/Footer'
import Container from '@mui/material/Container'

function Register() {
  const [nombres, setNombres] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [nombresError, setNombresError] = useState('')
  const [apellidosError, setApellidosError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')

  const navigate = useNavigate()

  const isFormInvalid = () => {
    return !nombres || !apellidos || !email || !password ||
      !!nombresError || !!apellidosError || !!emailError || !!passwordError
  }

  const validateNombres = () => {
    if (!nombres.trim()) {
      setNombresError('Nombres es requerido.')
      return false
    }
    setNombresError('')
    return true
  }

  const validateApellidos = () => {
    if (!apellidos.trim()) {
      setApellidosError('Apellidos es requerido.')
      return false
    }
    setApellidosError('')
    return true
  }

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email es requerido.')
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Formato de email inválido.')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Contraseña es requerida.')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleNombresChange = (event) => {
    setNombres(event.target.value)
    if (nombresError) {
      validateNombres()
    }
  }

  const handleApellidosChange = (event) => {
    setApellidos(event.target.value)
    if (apellidosError) {
      validateApellidos()
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    if (emailError) {
      validateEmail()
    }
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    if (passwordError) {
      validatePassword()
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isNombresValid = validateNombres()
    const isApellidosValid = validateApellidos()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (!isNombresValid || !isApellidosValid || !isEmailValid || !isPasswordValid) {
      handleSnackbar('Formulario inválido. Por favor, corrija los errores.', 'error')
      return
    }

    try {
      const response = await fetch(`${environment.apiUrl}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres: nombres.toLocaleUpperCase('es-AR'),
          apellidos: apellidos.toLocaleUpperCase('es-AR'),
          email: email.toLocaleUpperCase('es-AR'),
          password: password,
        }),
      })

      if (response.ok) {
        handleSnackbar('Registro exitoso. Redirigiendo al inicio de sesión...')
        setTimeout(() => {
          handleNavigateToLogin()
        }, 2000)
      } else {
        const data = await response.json()
        if (data.errors) {
          const mensajesError = validarMensajesErrorRegistro(data.errors)
          handleSnackbar(`Error al registrar el usuario: ${mensajesError}`, 'error')
        } else {
          handleSnackbar(`Error al registrar el usuario: ${data.message}`, 'error')
        }
      }
    } catch (error) {
      handleSnackbar(`Error al registrar el usuario: ${error}`, 'error')
    }
  }

  const validarMensajesErrorRegistro = (errores) => {
    const erroresEmail = errores.email
    const erroresPassword = errores.password

    let mensajesErrorEmail = ''
    let mennsajesErrorPassword = ''

    if (erroresEmail && erroresEmail.length > 0) {
      mensajesErrorEmail = erroresEmail.join(', ')
    }

    if (erroresPassword && erroresPassword.length > 0) {
      mennsajesErrorPassword = erroresPassword.join(', ')
    }

    const mensajesError = `${mensajesErrorEmail} ${mennsajesErrorPassword}`
    return mensajesError
  }

  const handleNavigateToLogin = () => {
    navigate('/login')
  }

  const handleSnackbar = (mensaje, severidad = 'success') => {
    setSnackbarMessage(mensaje)
    setSnackbarSeverity(severidad)
    setOpenSnackbar(true)
  }

  const handleCloseSnackbar = (_, razon) => {
    if (razon === 'clickaway') {
      return
    }

    setOpenSnackbar(false)
  }

  return (
    <Box className='background-app'>
      <Container className="login-container-white">
        <Grid container sx={{ flexGrow: 1, alignItems: 'stretch' }}>
          <Grid size={{ xs: 12, md: 6 }} className="register-info-column">
            <img src="/logo_app.png" alt="Fit Manager Logo" className="register-logo-white" />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mt: 2, color: '#000000' }}>
              Fit Manager
            </Typography>
            <Typography variant="h6" component="p" sx={{ mt: 1, mb: 3, color: '#333333', maxWidth: '80%' }}>
              Gestioná tu cuenta de forma fácil y rápida
            </Typography>
            <Box sx={{ textAlign: 'left', width: '100%', maxWidth: '400px', color: '#000000' }}>
              <Typography variant="body1" component="div" sx={{ mb: 1, fontWeight: '500' }}>
                Con Fit Manager podés:
              </Typography>
              <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                <li>Actualizar tus datos personales de forma rápida y segura</li>
                <li>Inscribirte a clases y administrar tus turnos</li>
                <li>Consultar tu historial de pagos y comprobantes</li>
                <li>Revisar el historial de clases realizadas</li>
                <li>Contactarte con nosotros</li>
              </ul>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: { xs: '16px', md: '32px' } }}>
            <Box className="register-box-white">
              <Typography component="h1" variant="h5" className="register-title-white">
                Crear Cuenta
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate className="register-form-white">
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="nombres"
                  label="Nombres"
                  name="nombres"
                  autoComplete="given-name"
                  value={nombres}
                  onChange={handleNombresChange}
                  onBlur={validateNombres}
                  error={!!nombresError}
                  helperText={nombresError}
                  className="register-textfield-white"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="apellidos"
                  label="Apellidos"
                  name="apellidos"
                  autoComplete="family-name"
                  value={apellidos}
                  onChange={handleApellidosChange}
                  onBlur={validateApellidos}
                  error={!!apellidosError}
                  helperText={apellidosError}
                  className="register-textfield-white"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={validateEmail}
                  error={!!emailError}
                  helperText={emailError}
                  className="register-textfield-white"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={validatePassword}
                  error={!!passwordError}
                  helperText={passwordError}
                  className="register-textfield-white"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            className="register-visibility-icon-white"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="register-submit-button-white"
                  disabled={isFormInvalid()}
                >
                  Registrarse
                </Button>
                <Grid container justifyContent="center" sx={{ mt: 2 }}>
                  <Grid size={12} sx={{ textAlign: 'center' }}>
                    <RouterLink to="/login" variant="body2" className="login-link-white">
                      ¿Ya tenés una cuenta? Iniciá Sesión
                    </RouterLink>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Footer />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  )
}

export default Register
