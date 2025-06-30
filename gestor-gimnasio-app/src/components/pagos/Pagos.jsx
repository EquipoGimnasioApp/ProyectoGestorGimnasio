import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import environment from '../../environments/environment'
import CargaTabla from '../clases-carga/CargaTabla'

const Pagos = () => {
    const [pagos, setPagos] = useState([])
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        fetch(`${environment.apiUrl}/pagos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setPagos(data)
                setCargando(false)
            })
            .catch(() => setCargando(false))
    }, [])

    const capitalizarNombreCompleto = (nombre, apellido) => {
        return (nombre + ' ' + apellido)
            .split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
            .join(' ')
    }

    const pagosOrdenados = [...pagos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

    return (
        <>
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
                                ) : pagosOrdenados.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>No hay pagos registrados.</TableCell>
                                    </TableRow>
                                ) : (
                                    pagosOrdenados.map((pago) => (
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
                </Paper>
            </div>
        </>
    )
}

export default Pagos