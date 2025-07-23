// src/pages/Register.js
import React from "react";
import { Box, Grid } from "@mui/material";
import RegistrationForm from "../components/RegistrationForm";

const Register = () => {
  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            backgroundImage: "url(Register.png)", // Asegúrate de poner la ruta correcta
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <RegistrationForm />
      </Grid>
    </Grid>
  );
};

export default Register;
