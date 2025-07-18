// src/components/CategoryList.js
import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";

const CategoryList = ({ categories, selectedCategories, onCategorySelect }) => {
  const handleCheckboxChange = (categoryId) => {
    onCategorySelect(categoryId);
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: "4px" }}>
      <Typography variant="h6" gutterBottom>
        Categories
      </Typography>
      <List>
        {categories.map((category) => (
          <ListItem key={category.id}>
            <FormControlLabel
              control={
                <Checkbox
                  name={category.name}
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCheckboxChange(category.id)}
                />
              }
              label={<ListItemText primary={category.name} component="span" />}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CategoryList;
