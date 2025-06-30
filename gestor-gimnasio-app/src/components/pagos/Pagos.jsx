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
        </>
    )
}

export default Pagos