import { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
} from "@mui/material";

const tiposDocumento = [
    { value: "DNI", label: "DNI" },
    { value: "Libreta Cívica", label: "Libreta Cívica" },
    { value: "Libreta de Enrolamiento", label: "Libreta de Enrolamiento" },
];

const paises = [
    { value: "Argentina", label: "Argentina" },
];

export default function EditarPerfil() {
    const [form, setForm] = useState({
        dia: "",
        mes: "",
        anio: "",
        telefono: "",
        telefonoEmergencia: "",
        tipoDocumento: "",
        documento: "",
        coberturaMedica: "",
        observaciones: "",
        direccion: "",
        ciudad: "",
        codigoPostal: "",
        pais: "Argentina",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFoto = (accion) => {
        // Lógica para tomar, subir o eliminar foto
        alert(`Acción de foto: ${accion}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica para guardar los datos
        alert("Datos guardados (simulado)");
    };

    return (
        <>
            <h2 className="titulo-clases" > Editar Datos Personales</h2>
            <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
                        <Avatar sx={{ width: 150, height: 150, mr: 3 }} />
                        <Box sx={{ display: "flex", flexDirection: "column", width: "180px" }}>
                            <Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => handleFoto("tomar")}>
                                Tomar una foto
                            </Button>
                            <Button variant="outlined" fullWidth sx={{ mb: 1 }} onClick={() => handleFoto("subir")}>
                                Subir una foto
                            </Button>
                            <Button variant="outlined" fullWidth color="error" onClick={() => handleFoto("eliminar")}>
                                Eliminar la foto
                            </Button>
                        </Box>
                    </Box>
                </Box>
                <Typography variant="h4" align="left" mb={2} sx ={{  marginBottom: 8, marginTop: 8 }}>
                    Mariano Costa
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Fecha de Nacimiento  "
                        name="fechaNacimiento"
                        value={form.fechaNacimiento}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <TextField
                                label="Día"
                                name="dia"
                                value={form.dia}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Mes"
                                name="mes"
                                value={form.mes}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                label="Año"
                                name="anio"
                                value={form.anio}
                                onChange={handleChange}
                                fullWidth
                                size="small"
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        label="Teléfono"
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Teléfono de Emergencia"
                        name="telefonoEmergencia"
                        value={form.telefonoEmergencia}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Tipo de Documento</InputLabel>
                        <Select
                            name="tipoDocumento"
                            value={form.tipoDocumento}
                            label="Tipo de Documento"
                            onChange={handleChange}
                        >
                            {tiposDocumento.map((tipo) => (
                                <MenuItem key={tipo.value} value={tipo.value}>
                                    {tipo.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Documento de Identidad"
                        name="documento"
                        value={form.documento}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Obra Social / Seguro Médico"
                        name="coberturaMedica"
                        value={form.coberturaMedica}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Observaciones sobre Salud"
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>País/región</InputLabel>
                        <Select
                            name="pais"
                            value={form.pais}
                            label="País/región"
                            onChange={handleChange}
                        >
                            {paises.map((pais) => (
                                <MenuItem key={pais.value} value={pais.value}>
                                    {pais.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Dirección"
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Ciudad"
                        name="ciudad"
                        value={form.ciudad}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Código postal"
                        name="codigoPostal"
                        value={form.codigoPostal}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="boton-principal"
                        fullWidth

                    >
                        Guardar
                    </Button>
                </form>
            </Box>
        </>
    );
}