import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import './HistorialPagos.css';
import environment from '../../environments/environment';

const HistorialPagos = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`${environment.apiUrl}/pagos/${usuario.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
      .then((res) => res.json())
      .then((data) => {
        setPagos(data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>N° Comprobante</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Monto</TableCell>
            <TableCell>Forma de pago</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cargando ? (
            <TableRow>
              <TableCell colSpan={4}>Cargando...</TableCell>
            </TableRow>
          ) : pagos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4}>No hay pagos registrados</TableCell>
            </TableRow>
          ) : (
            pagos.map((pago) => (
              <TableRow key={pago.id}>
                <TableCell>{pago.id}</TableCell>
                <TableCell>{pago.fecha}</TableCell>
                <TableCell>{pago.monto}</TableCell>
                <TableCell>{pago.id_forma_pago}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HistorialPagos;
