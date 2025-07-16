// src/App.js
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Importa el archivo del tema

function AppContent() {
  const location = useLocation();
  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showHeader && <Header />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
      {showHeader && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        {" "}
        {/* Envuelve tu contenido con ThemeProvider */}
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;
