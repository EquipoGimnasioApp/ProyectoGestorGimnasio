import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';
import RutaProtegida from './components/auth/RutaProtegida/RutaProtegida';
import Dashboard from './components/layouts/dashboard/Dashboard';
import ForgottenPassword from './components/forgotten-password/ForgottenPassword';
import Clases from './components/clases/Clases';
import AbmTurnoClase from './abm-tunos-clases/AbmTurnoClase';
import AbmTipoActividad from './components/abm-tipo-actividad/AbmTipoActividad';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

function App() {
  const usuarioEstaLogueado = localStorage.getItem('usuarioAccesToken');

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgottenPassword />} />

        {/* Rutas protegidas */}
        <Route element={<RutaProtegida />}>
          <Route path='/dashboard' element={<Dashboard />}>
            <Route path="/dashboard/clases" element={<Clases />} />
            <Route path='/dashboard/abm/clases' element={<AbmTurnoClase />} />
            <Route path='/dashboard/abm/tipos-actividad' element={<AbmTipoActividad />} />
          </Route>
        </Route>

        <Route path='*' element={
          usuarioEstaLogueado
            ? <Navigate to='/dashboard' replace />
            : <Navigate to='/login' replace />
        } />
      </Routes>
    </Router>
  )
}

export default App
