import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import environment from '../../environments/environment'
import CargaTabla from '../clases-carga/CargaTabla'

const Pagos = () => {
    const [pagos, setPagos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [busquedaAlumno, setBusquedaAlumno] = useState('')
    const [busquedaFormaDePago, setBusquedaFormaDePago] = useState('')
    const [busquedaFecha, setBusquedaFecha] = useState(null)

    const getPagos = () => {
        setCargando(true)
        fetch(`${environment.apiUrl}/pagos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setPagos(data)
                setCargando(false)
            })
            .catch(() => setCargando(false))
    }

    useEffect(() => {
        getPagos()
    }, [])

    const capitalizarNombreCompleto = (nombre, apellido) => {
        return (nombre + ' ' + apellido)
            .split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
            .join(' ')
    }

    const pagosOrdenados = [...pagos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    const pagosFiltrados = pagosOrdenados.filter((pago) => {
        const nombreCompleto = capitalizarNombreCompleto(pago.usuario.nombres, pago.usuario.apellidos)
        const coincideAlumno = nombreCompleto.toLowerCase().includes(busquedaAlumno.toLowerCase())
        const coincideForma = pago.forma_pago.descripcion.toLowerCase().includes(busquedaFormaDePago.toLowerCase())
        const coincideFecha = !busquedaFecha ||
            (pago.fecha && busquedaFecha && pago.fecha.startsWith(busquedaFecha.format('YYYY-MM-DD')))
        return coincideAlumno && coincideForma && coincideFecha
    })

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    <h2 className='titulo-clases'>Pagos Registrados</h2>

                    <Box
                        sx={{
                            maxWidth: 900,
                            width: '100%',
                            mb: 2,
                            mt: 2,
                            display: 'flex',
                            gap: 2,
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}
                    >
                        <TextField
                            label='Buscar Alumno'
                            variant='outlined'
                            size='small'
                            value={busquedaAlumno}
                            onChange={e => setBusquedaAlumno(e.target.value)}
                            disabled={cargando}
                            sx={{
                                width: '100%',
                                maxWidth: 280,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#ffffff',
                                },
                            }}
                        />

                        <TextField
                            label='Forma de pago'
                            variant='outlined'
                            size='small'
                            value={busquedaFormaDePago}
                            onChange={e => setBusquedaFormaDePago(e.target.value)}
                            disabled={cargando}
                            sx={{
                                width: '100%',
                                maxWidth: 280,
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#ffffff',
                                },
                            }}
                        />

                        <DatePicker
                            label='Buscar Fecha'
                            value={busquedaFecha}
                            onChange={nuevaFecha => setBusquedaFecha(nuevaFecha)}
                            format='DD/MM/YYYY'
                            disabled={cargando}
                            slotProps={{
                                textField: {
                                    size: 'small',
                                    sx: {
                                        width: '100%',
                                        maxWidth: 280,
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#ffffff',
                                        },
                                    },
                                },
                            }}
                        />
                    </Box>

                    <TableContainer component={Paper} className='equipamiento-table'>
                        <Table>
                            {!cargando && (
                                <TableHead className='cabecera-tabla-abm'>
                                    <TableRow>
                                        <TableCell>N° COMPROBANTE</TableCell>
                                        <TableCell>ALUMNO</TableCell>
                                        <TableCell>FECHA</TableCell>
                                        <TableCell>MONTO</TableCell>
                                        <TableCell>FORMA DE PAGO</TableCell>
                                    </TableRow>
                                </TableHead>
                            )}
                            <TableBody>
                                {cargando ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <CargaTabla texto='Cargando pagos...' />
                                        </TableCell>
                                    </TableRow>
                                ) : pagosFiltrados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>No hay pagos registrados.</TableCell>
                                    </TableRow>
                                ) : (
                                    pagosFiltrados.map((pago) => (
                                        <TableRow key={pago.id}>
                                            <TableCell>{pago.id}</TableCell>
                                            <TableCell>{capitalizarNombreCompleto(pago.usuario.nombres, pago.usuario.apellidos)}</TableCell>
                                            <TableCell>{pago.fecha}</TableCell>
                                            <TableCell>{pago.monto}</TableCell>
                                            <TableCell>{pago.forma_pago.descripcion}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button
                            variant="outlined"
                            disabled={cargando}
                            className="boton-principal"
                            sx={{ ml: 2 }}
                            onClick={getPagos}
                        >
                            Actualizar
                        </Button>
                    </Box>
                </Paper>
            </div>
        </LocalizationProvider>
    )
}

export default Pagos