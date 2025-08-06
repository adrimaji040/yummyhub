import { useState, useEffect } from "react";
import { Button, Container, TextField, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Estado para mensajes de error
  const navigate = useNavigate();

  // Verificación del localStorage al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Limpiar el mensaje de error

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.access_token) {
          // Almacena el token en localStorage
          localStorage.setItem("token", data.access_token);
          navigate("/");
        } else {
          setError("Registration failed. Please try again.");
        }
      })
      .catch((error) => setError("Error: Failed to fetch"));
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Register
        </Button>
      </form>
      <Typography sx={{ mt: 2 }}>
        Already have an account?{" "}
        <Link href="/login" variant="body2">
          Login
        </Link>
      </Typography>
    </Container>
  );
};

export default RegistrationForm;
