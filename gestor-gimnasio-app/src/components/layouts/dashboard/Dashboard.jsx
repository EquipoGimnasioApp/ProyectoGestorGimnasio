import Header from "../header/Header"
import Container from "@mui/material/Container"
import Box from "@mui/material/Box"
import Footer from "../footer/Footer"
import { Outlet, useLocation } from "react-router-dom"

function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const location = useLocation();
  // Verifica si el usuario está en la ruta del dashboard
  // y si el usuario tiene un nombre definido
  const mostrarSaludo = location.pathname === '/dashboard';


  console.log("Usuario en Dashboard:", usuario);
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
