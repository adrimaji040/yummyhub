import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const RecipeSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
      <TextField
        label="Search Recipes"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        InputProps={{
          style: {
            backgroundColor: "#fff",
            borderRadius: "4px",
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ ml: 2, height: "55px" }}
        onClick={handleSearch}
      >
        Search
      </Button>
    </Box>
  );
};

export default RecipeSearch;
