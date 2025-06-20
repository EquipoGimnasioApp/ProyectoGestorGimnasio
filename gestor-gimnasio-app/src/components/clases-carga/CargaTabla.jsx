import { Box, CircularProgress, Typography } from "@mui/material";
import PropTypes from "prop-types";

export default function CargaTabla({ texto = "Cargando..." }) {
  if (!texto) {
    texto = "Cargando...";
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
      <CircularProgress sx={{ mr: 2 }} />
      <Typography>{texto}</Typography>
    </Box>
  );
}

CargaTabla.propTypes = {
  texto: PropTypes.string
};
