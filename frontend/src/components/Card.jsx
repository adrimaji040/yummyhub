// src/components/Card.js
import React from "react";
import { Link } from "react-router-dom";
import {
  Card as MUICard,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Rating,
  Avatar,
  CardHeader,
} from "@mui/material";
import { red } from "@mui/material/colors";

const Card = ({ recipe }) => {
  const { id, cover_photo_url, title, cooking_time, rating, user_name } =
    recipe;

  return (
    <MUICard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {console.log(recipe)}

      <CardActionArea>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
              {user_name[0]?.toUpperCase() || "R"}
            </Avatar>
          }
          title={
            <Link
              to={`/recipe/${recipe.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {recipe.title}
            </Link>
          }
        />

        <Link
          to={`/recipe/${id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <CardMedia
            component="img"
            height="140"
            image={cover_photo_url}
            alt={title}
          />
        </Link>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Cooking Time: {cooking_time} minutes
          </Typography>
          <Rating name="read-only" value={rating} readOnly />
        </CardContent>
      </CardActionArea>
    </MUICard>
  );
};

export default Card;
