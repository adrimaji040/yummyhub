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
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register.jsx";
import AddRecipe from "./pages/AddRecipe.jsx";
import Recipe from "./pages/Recipe";
import Recipes from "./pages/Recipes";
import MealPlanListPage from "./pages/MealPlanListPage.jsx";
import Favorites from "./pages/Favorites";

import About from "./pages/About.jsx";
import ShoppingList from "./pages/ShoppingList.jsx";


import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { UserProvider } from "./store/UserProvider";

function AppContent() {
  const location = useLocation();
  const showHeader =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />{" "}
        <Route path="/recipe/add" element={<AddRecipe />} />{" "}
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/mealplans" element={<MealPlanListPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/shoppinglist" element={<ShoppingList />} />
      </Routes>
      {showHeader && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
