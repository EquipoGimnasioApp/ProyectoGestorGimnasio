import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"
import Login from "./components/auth/login/Login"
import Register from "./components/auth/register/Register"
import RutaProtegida from "./components/auth/RutaProtegida/RutaProtegida"
import Dashboard from "./components/layouts/dashboard/Dashboard"
import ForgottenPassword from "./components/forgotten-password/ForgottenPassword"
import AgendarClases from "./components/agendar-clases/AgendarClases"
import AbmTurnoClase from "./components/abm-tunos-clases/AbmTurnoClase"
import AbmTipoActividad from "./components/abm-tipo-actividad/AbmTipoActividad"
import AbmSalas from "./components/abm-salas/AbmSalas"
import AbmEquipamiento from "./components/abm-equipamiento/AmbEquipamiento"
import Contacto from "./components/contacto/Contacto"
import Actividades from "./components/actividades/Actividades"
import MensajesAdministrador from "./components/mensajes-internos-administrador/MensajesAdministrador"
import Mensajes from "./components/mensajes-internos/Mensajes"
import AbmUsuarios from "./components/abm-usuarios/AbmUsuarios"
import EditarPerfil from "./components/editar-perfil/EditarPerfil"
import TomaAsistencia from "./components/toma-asistencia/TomaAsistencia"
import HistorialPagos from "./components/historial-pagos/HistorialPagos"
import AdminDashboard from "./components/bienvenida/AdminDashboard"
import AlumnoDashboard from "./components/bienvenida/AlumnoDashboard"
import ProfesorDashboard from "./components/bienvenida/ProfesorDashboard"
import MiRutina from './components/mi-rutina/MiRutina'
import AsignarRutina from "./components/asignar-rutina/AsignarRutina"
import Pagos from "./components/pagos/Pagos"


import dayjs from "dayjs"
import "dayjs/locale/es"
import Landing from "./components/layouts/landing/Landing"

dayjs.locale("es")

function App() {
  const usuarioEstaLogueado = localStorage.getItem("usuarioAccesToken")

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgottenPassword />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/" element={<Landing />} />

        {/* Rutas protegidas */}
        <Route element={<RutaProtegida />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="/dashboard/agendar-clases" element={<AgendarClases />} />
            <Route path="/dashboard/actividades" element={<Actividades />} />
            <Route path="/dashboard/mensajes" element={<Mensajes />} />
            <Route path="/dashboard/editar-perfil" element={<EditarPerfil />} />
            <Route path="/dashboard/tomar-asistencia" element={<TomaAsistencia />} />
            <Route path="/dashboard/admin-mensajes" element={<MensajesAdministrador />} />
            <Route path="/dashboard/abm/clases" element={<AbmTurnoClase />} />
            <Route path="/dashboard/abm/tipos-actividad" element={<AbmTipoActividad />} />
            <Route path="/dashboard/abm/salas" element={<AbmSalas />} />
            <Route path="/dashboard/historial-pagos" element={<HistorialPagos />} />
            <Route path="/dashboard/abm/equipamiento" element={<AbmEquipamiento />} />
            <Route path="/dashboard/abm/usuarios" element={<AbmUsuarios />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/alumno" element={<AlumnoDashboard />} />
            <Route path="/dashboard/profesor" element={<ProfesorDashboard />} />
            <Route path='/dashboard/mi-rutina' element={<MiRutina />} />
            <Route path='/dashboard/asignar-rutina' element={<AsignarRutina />} />
            <Route path='/dashboard/pagos' element={<Pagos />} />
          </Route>
        </Route>
        <Route path="*" element={usuarioEstaLogueado ?
          (<Navigate to="/dashboard" replace />) : (<Navigate to="/" replace />)} />
      </Routes>
    </Router>
  )
}

export default App
