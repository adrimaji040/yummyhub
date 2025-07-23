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
} from "@mui/material";

const Card = ({ recipe }) => {
  const { id, cover_photo_url, title, cooking_time, rating } = recipe;

  return (
    <MUICard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Link
        to={`/recipe/${id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={`../${cover_photo_url}`}
            alt={title}
          />
          <CardContent>
            <Typography component="div" fontWeight={600}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cooking Time: {cooking_time} minutes
            </Typography>
            <Rating name="read-only" value={rating} readOnly />
          </CardContent>
        </CardActionArea>
      </Link>
    </MUICard>
  );
};

export default Card;
