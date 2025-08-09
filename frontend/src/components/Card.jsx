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
  const { id, cover_photo_url, title, cooking_time, rating, user_name, user_id, } =
    recipe;

  return (
    <MUICard sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {console.log(recipe)}

      <CardActionArea>
        <CardHeader
          avatar={
            user_id ? (
              <Link
                to={`/user/${user_id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ display: "inline-flex" }}
                title={`View ${user_name || "user"}'s profile`}
              >
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  {initial}
                </Avatar>
              </Link>
            ) : (
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                {initial}
              </Avatar>
            )
          }
          title={
             <Link
              to={`/recipe/${id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {title}
            </Link>
          }
          subheader={
            user_name && user_id ? (
              <Link
                to={`/user/${user_id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ textDecoration: "none", color: "inherit" }}
                title={`View ${user_name}'s profile`}
              >
                By {user_name}
              </Link>
            ) : null
            }
          />

        <Link
          to={`/recipe/${id}`}
          onClick={(e) => e.stopPropagation()}
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
