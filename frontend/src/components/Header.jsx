// src/components/Header.js
import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomAppBar = styled(AppBar)({
  backgroundColor: "white",
  color: "black",
  boxShadow: "none",
  borderBottom: "1px solid #e0e0e0",
  width: "100vw",
  left: "50%",
  transform: "translateX(-50%)",
});

const NavLinks = styled("div")({
  marginRight: "auto",
  display: "flex",
});

const NavLink = styled(Link)({
  textDecoration: "none",
  marginLeft: "16px",
  marginRight: "16px",
});

const AuthButtons = styled("div")({
  marginLeft: "auto",
  display: "flex",
  alignItems: "center",
});

function Header() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3000/";

  return (
    <CustomAppBar>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6">
            <Box sx={{ width: "100%" }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <img
                  src={`/Logo.png`}
                  alt="Yummy hub"
                  style={{ width: "70%", height: "auto" }}
                />
              </Link>
            </Box>
          </Typography>
          <NavLinks>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/recipes">Recipes</NavLink>
          </NavLinks>
          <AuthButtons>
            {!token ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            ) : (
              <>
                <NavLink
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/recipe/add"
                  sx={{ ml: 2 }}
                >
                  + Add Recipe
                </NavLink>
                <NavLink to="/profile">Dashboard</NavLink>
                <Button
                  variant="contained"
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/");
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </AuthButtons>
        </Toolbar>
      </Container>
    </CustomAppBar>
  );
}

export default Header;
