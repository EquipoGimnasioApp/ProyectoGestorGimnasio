import { Box, Typography, Avatar, Grid } from "@mui/material";

export default function MiPerfil({ perfil }) {
  // Ejemplo de datos, reemplaza por los datos reales de tu backend
   const perfil = {
     nombreCompleto: "Mariano Costa",
     estadoMembresia: "Activa",
     email: "marianocosta@gmail.com",
     fechaNacimiento: "17/03/1998",
     telefono: "+54 1158654250",
     contactoEmergencia: "+54 1159657485 Silvina",
     documento: "40267042",
     obraSocial: "Swiss Medical",
     direccion: "Av. Arregui 4220, Villa del Parque, C.A.B.A."
   };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
      <Avatar sx={{ width: 120, height: 120, mx: "auto", mb: 2 }} />
      <Typography variant="h4" fontWeight={600}>{perfil.nombreCompleto}</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        <b>Estado de membresía:</b> {perfil.estadoMembresia}
      </Typography>
      <Grid container spacing={1} sx={{ textAlign: "left", mt: 2 }}>
        <Grid item xs={12}><b>Mail:</b> {perfil.email}</Grid>
        <Grid item xs={12}><b>Fecha de Nacimiento:</b> {perfil.fechaNacimiento}</Grid>
        <Grid item xs={12}><b>Teléfono:</b> {perfil.telefono}</Grid>
        <Grid item xs={12}><b>Contacto de Emergencia:</b> {perfil.contactoEmergencia}</Grid>
        <Grid item xs={12}><b>Documento de Identidad:</b> {perfil.documento}</Grid>
        <Grid item xs={12}><b>Obra Social o Seguro Médico:</b> {perfil.obraSocial}</Grid>
        <Grid item xs={12}><b>Dirección:</b> {perfil.direccion}</Grid>
      </Grid>
    </Box>
  );
}