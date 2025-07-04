import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import UsuarioDto from '../../../models/dtos/UsuarioDto.model.dto'
import NavigationButton from '../../navigation-button/NavigationButton'
import './Header.css'
import Avatar from '@mui/material/Avatar'
import environment from '../../../environments/environment'

function Header() {
  const token = useMemo(() => localStorage.getItem('usuarioAccesToken'), [])
  const [anchorMenuUsu, setAnchorMenuUsu] = useState(null)
  const [usuario, setUsuario] = useState(null)
  const navigate = useNavigate()

  function capitalizarNombre(nombre) {
    return (nombre)
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')
  }

  const mensajeDeBienvenida = useMemo(() => {
    return usuario?.nombres
      ? `¡Bienvenido/a, ${capitalizarNombre(usuario.nombres)}!`
      : '¡Bienvenido/a!'
  }, [usuario?.nombres])

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (usuarioGuardado) {
      const usuarioParseado = JSON.parse(usuarioGuardado)
      setUsuario(new UsuarioDto(usuarioParseado))
    }
  }, [])

  const [fotoPerfilUrl, setFotoPerfilUrl] = useState(undefined)

  useEffect(() => {
    if (usuario?.id) {
      getFotoPerfil(usuario.id)
    } else {
      setFotoPerfilUrl(undefined)
    }
  }, [usuario])

  const getFotoPerfil = async (idUsuario) => {
    try {
      const response = await fetch(`${environment.apiUrl}/perfiles/${idUsuario}/foto`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        setFotoPerfilUrl(undefined)
        return
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setFotoPerfilUrl(url)
    }
    catch (error) {
      console.error('Error al obtener la foto de perfil:', error)
      setFotoPerfilUrl(undefined)
    }
  }

  const handleMenu = (event) => {
    setAnchorMenuUsu(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorMenuUsu(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuarioAccesToken')
    localStorage.removeItem('usuarioTokenType')
    setUsuario(null)
    handleClose()
    navigate('/login')
  }

  function capitalizarNombreCompleto(nombre, apellido) {
    return (nombre + ' ' + apellido)
      .split(' ')
      .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <>
      {usuario && (
        <Box>
          <AppBar position="static" sx={{ backgroundColor: '#f8fafc' }}>
            <Toolbar>
              <>
                <img src="/logo_app.png" alt="Logo" style={{ height: 40, marginRight: 10 }} />
                <Typography
                  variant='h5'
                  component='div'
                  sx={{ color: '#000', cursor: 'pointer' }}
                  onClick={() => {
                    if (usuario && usuario.idTipoUsuario === 1) {
                      navigate('/dashboard/admin')
                    } else {
                      navigate('/dashboard')
                    }
                  }}
                >
                  Fit Manager
                </Typography>
              </>
              <NavigationButton usuario={usuario} colorButtons="#000" />

              <Typography
                variant="subtitle1"
                sx={{ color: '#000', fontWeight: 500, display: { xs: 'none', sm: 'block' } }}
              >
                {mensajeDeBienvenida}
              </Typography>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  sx={{ color: '#000' }}
                >
                  <Avatar
                    src={fotoPerfilUrl}
                    sx={{ width: 35, height: 35 }}
                  >
                    {!fotoPerfilUrl && <AccountCircle sx={{ fontSize: 35 }} />}
                  </Avatar>
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorMenuUsu}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorMenuUsu)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      minWidth: 300
                    }
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="subtitle1">{`Nombre: ${capitalizarNombreCompleto(usuario.nombres, usuario.apellidos)}`}</Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="subtitle1">{`Email: ${usuario.email.toLowerCase()}`}</Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="subtitle1">{`Rol: ${usuario.descTipoUsuario.charAt(0).toUpperCase() + usuario.descTipoUsuario.slice(1).toLowerCase()}`}</Typography>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      justifyContent: 'center',
                      paddingY: '6px',
                      '&:hover, &.Mui-focusVisible': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Button
                      href="/dashboard/editar-perfil"
                      variant="contained"
                      className="boton-secundario"
                      sx={{ width: '70%' }}
                    >
                      Mi Perfil
                    </Button>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      justifyContent: 'center',
                      paddingY: '6px',
                      '&:hover, &.Mui-focusVisible': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <Button
                      variant="contained"
                      className="boton-principal"
                      onClick={handleLogout}
                      sx={{ width: '70%' }}
                    >
                      Cerrar Sesión
                    </Button>
                  </MenuItem>
                </Menu>
              </div>
            </Toolbar>
          </AppBar>
        </Box >
      )
      }
    </>
  )
}

export default Header
