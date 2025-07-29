// src/components/CardWithMenu.js
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Box,
  Rating,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const ExpandMore = styled((props) => {
  const { ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CardWithMenu = ({ recipe, onDelete }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation(); // 👈 esto evita que el clic también active handleView
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/recipe/edit/${recipe.id}`);
  };

  const handleView = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const handleDelete = (e) => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      onDelete(recipe);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {recipe.user_name[0]?.toUpperCase() || "R"}
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon sx={{ mr: 1 }} /> Edit
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon sx={{ mr: 1 }} /> Delete
              </MenuItem>
            </Menu>
          </>
        }
        title={
          <Link
            to={`/recipe/${recipe.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {recipe.title}
          </Link>
        }
        subheader={
          recipe.created_at
            ? new Date(recipe.created_at).toLocaleDateString()
            : ""
        }
        sx={{ cursor: "pointer" }}
      />
      <CardMedia
        component="img"
        height="194"
        image={recipe.cover_photo_url || "/upload/default.jpg"}
        alt={recipe.title}
        sx={{ objectFit: "cover", cursor: "pointer" }}
        onClick={handleView}
      />
      <CardContent onClick={handleView} sx={{ cursor: "pointer" }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
          Cooking Time: {recipe.cooking_time} minutes
        </Typography>

        <CardActions disableSpacing>
          <Rating name="read-only" value={recipe.rating} readOnly />
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default CardWithMenu;
