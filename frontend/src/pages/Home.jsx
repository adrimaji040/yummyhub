import "../css/Home.css";
import Hero from "../components/Hero";
import RecipesCards from "../components/RecipesCards";
import CategoriesShowcase from "../components/CategoriesShowcase";

function Home() {
  return (
    <>
      <Hero />
      <RecipesCards />
      <CategoriesShowcase />
    </>
  );
}

export default Home;
