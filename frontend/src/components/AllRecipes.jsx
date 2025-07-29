// src/components/AllRecipes.js
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import Card from "./Card";

const AllRecipes = ({ recipes, loading, error }) => {
  return (
    <Box sx={{ my: 5 }}>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid size={4} key={recipe.id}>
              <Card recipe={recipe} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AllRecipes;
