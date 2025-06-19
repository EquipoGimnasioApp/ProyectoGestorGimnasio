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
import TomaAsistencia from "./components/toma-asistencia/TomaAsistencia"

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
            <Route path="/dashboard/tomar-asistencia" element={<TomaAsistencia />} />
            <Route path="/dashboard/admin-mensajes" element={<MensajesAdministrador />} />
            <Route path="/dashboard/abm/clases" element={<AbmTurnoClase />} />
            <Route path="/dashboard/abm/tipos-actividad" element={<AbmTipoActividad />} />
            <Route path="/dashboard/abm/salas" element={<AbmSalas />} />
            <Route path="/dashboard/abm/equipamiento" element={<AbmEquipamiento />} />
          </Route>
        </Route>

        <Route
          path="*"
          element={usuarioEstaLogueado ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  )
}

export default App
