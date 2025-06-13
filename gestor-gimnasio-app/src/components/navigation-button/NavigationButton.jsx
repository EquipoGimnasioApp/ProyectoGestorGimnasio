import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import EventNoteIcon from "@mui/icons-material/EventNote"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import BuildIcon from "@mui/icons-material/Build"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import TiposUsuarioEnum from "../../models/enums/TiposUsuarioEnum.models.enum.js"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

function NavigationButton({ usuario, colorButtons = "#000" }) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  if (!usuario) {
    return null
  }

  const idTipoUsuario = parseInt(usuario.idTipoUsuario, 10)

  const puedeVerAgendarClases =
    idTipoUsuario === TiposUsuarioEnum.ALUMNO || idTipoUsuario === TiposUsuarioEnum.ADMINISTRADOR

  const puedeVerContactoAlumno =
    idTipoUsuario === TiposUsuarioEnum.ALUMNO ||
    idTipoUsuario === TiposUsuarioEnum.PROFESOR ||
    idTipoUsuario === TiposUsuarioEnum.ADMINISTRADOR

  const puedeVerActividades =
    idTipoUsuario === TiposUsuarioEnum.PROFESOR || idTipoUsuario === TiposUsuarioEnum.ADMINISTRADOR

  const puedeVerAbm = idTipoUsuario === TiposUsuarioEnum.ADMINISTRADOR

  const handleAbmClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleAbmClose = () => {
    setAnchorEl(null)
  }

  const handleAbmClasesClick = () => {
    navigate("/dashboard/abm/clases")
    handleAbmClose()
  }

  const handleAbmTiposActividadClick = () => {
    navigate("/dashboard/abm/tipos-actividad")
    handleAbmClose()
  }

  const handleAbmSalasClick = () => {
    navigate("/dashboard/abm/salas")
    handleAbmClose()
  }

  const handleAbmEquipamientoClick = () => {
    navigate("/dashboard/abm/equipamiento")
    handleAbmClose()
  }

  return (
    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.15rem" }}>
      {puedeVerAgendarClases && (
        <Button
          color="inherit"
          startIcon={<FitnessCenterIcon />}
          sx={{ textTransform: "none", mx: 1, color: colorButtons, fontSize: "1em" }}
          onClick={() => navigate("/dashboard/agendar-clases")}
        >
          Agendar
        </Button>
      )}
      {puedeVerContactoAlumno && (
        <Button
          color="inherit"
          startIcon={<MailOutlineIcon />}
          sx={{ textTransform: "none", mx: 1, color: colorButtons, fontSize: "1em" }}
          onClick={() => navigate("/dashboard/contacto")}
        >
          Contacto
        </Button>
      )}
      {puedeVerActividades && (
        <Button
          color="inherit"
          startIcon={<EventNoteIcon />}
          sx={{ textTransform: "none", mx: 1, color: colorButtons, fontSize: "1em" }}
          onClick={() => navigate("/dashboard/actividades")}
        >
          Actividades
        </Button>
      )}
      {puedeVerAbm && (
        <>
          <Button
            color="inherit"
            startIcon={<BuildIcon />}
            endIcon={<ArrowDropDownIcon />}
            sx={{ textTransform: "none", mx: 1, color: colorButtons, fontSize: "1em" }}
            onClick={handleAbmClick}
            aria-controls="abm-menu"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
          >
            ABM
          </Button>
          <Menu
            id="abm-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleAbmClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuItem onClick={handleAbmClasesClick}>ABM Clases</MenuItem>
            <MenuItem onClick={handleAbmTiposActividadClick}>ABM Actividades</MenuItem>
            <MenuItem onClick={handleAbmSalasClick}>ABM Salas</MenuItem>
            <MenuItem onClick={handleAbmEquipamientoClick}>ABM Equipamiento</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  )
}

NavigationButton.propTypes = {
  usuario: PropTypes.shape({
    idTipoUsuario: PropTypes.oneOf([TiposUsuarioEnum.ALUMNO, TiposUsuarioEnum.PROFESOR, TiposUsuarioEnum.ADMINISTRADOR])
      .isRequired,
  }),
  colorButtons: PropTypes.string,
}

export default NavigationButton
