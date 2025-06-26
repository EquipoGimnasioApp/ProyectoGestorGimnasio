import Header from "../header/Header"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Footer from "../footer/Footer"
<<<<<<< HEAD
import { Outlet, useLocation } from "react-router-dom"

function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const location = useLocation();
  // Verifica si el usuario está en la ruta del dashboard
  // y si el usuario tiene un nombre definido
  const mostrarSaludo = location.pathname === '/dashboard';


  console.log("Usuario en Dashboard:", usuario);
=======
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"

function Dashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const usuario = JSON.parse(localStorage.getItem("usuario"))

  useEffect(() => {
    if (usuario && usuario.idTipoUsuario === 1 && location.pathname === "/dashboard") {
      navigate("/dashboard/admin", { replace: true })
    } else if (usuario && usuario.idTipoUsuario === 2 && location.pathname === "/dashboard") {
      navigate("/dashboard/alumno", { replace: true })
    } else if (usuario && usuario.idTipoUsuario === 3 && location.pathname === "/dashboard") {
      navigate("/dashboard/profesor", { replace: true })
    }
  }, [usuario, navigate, location.pathname])

>>>>>>> main
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Header />
      <Container
        maxWidth="xl"
        component="main"
        sx={{
          mt: 4,
          mb: 4,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            maxWidth: "xl",
          }}
        >
          <Outlet />
        </Box>
      </Container>
      <Footer />
    </Box>
  )
}

export default Dashboard
