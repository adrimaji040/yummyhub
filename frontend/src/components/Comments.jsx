import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  CircularProgress,
  Avatar,
  Rating,
} from "@mui/material";
import { useUser } from "../store/UserContext";

const Comments = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [rating, setRating] = useState(0);

  const { user } = useUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/recipe/${recipeId}/comments`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRating = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/votes/user/${recipeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRating(data.rating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchComments();
    if (isLoggedIn) fetchUserRating();
  }, [recipeId, isLoggedIn]);

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSnackbarMessage("You must be logged in to comment.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          content: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const comment = await response.json();
      setComments([...comments, comment]);
      setNewComment("");
      setSnackbarMessage("Comment added successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!isLoggedIn) {
      setSnackbarMessage("You must be logged in to rate.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    setRating(newValue);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          rating: newValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      setSnackbarMessage("Rating submitted!");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ pt: 10 }}>
        Comments
      </Typography>
      {error && <Typography color="error">{error}</Typography>}

      {/* Rating */}
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography component="legend">Rate this recipe</Typography>
        <Rating
          name="recipe-rating"
          value={rating}
          onChange={handleRatingChange}
          precision={1}
        />
      </Box>

      <List>
        {comments.length === 0 ? (
          <Typography>No comments yet. Be the first to comment!</Typography>
        ) : (
          comments.map((comment) => (
            <ListItem key={comment.id}>
              <Avatar sx={{ mr: 2 }}>
                {comment.user && comment.user.name
                  ? comment.user.name.charAt(0)
                  : "U"}
              </Avatar>
              <ListItemText
                primary={comment.content}
                secondary={`User: ${
                  comment.user ? comment.user.name : "Unknown User"
                }`}
              />
            </ListItem>
          ))
        )}
      </List>

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleAddComment}
        >
          Add Comment
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Comments;
