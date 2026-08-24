import React, { useContext } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import {
  Link,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";

const LandingPage: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const benefits = [
    "Filter movies by title and genre",
    "Filter actors by name",
    "Save your favourite movies",
    "Save your favourite actors",
    "Create personalised movie playlists",
  ];

  return (
    <Paper
      sx={{
        maxWidth: 900,
        margin: "60px auto",
        padding: {
          xs: 3,
          md: 5,
        },
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
      >
        Welcome to DaddyMovies
      </Typography>

      <Typography
        variant="h5"
        component="p"
        gutterBottom
      >
        Discover movies, actors and upcoming
        releases.
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginBottom: 4 }}
      >
        Create a free account to unlock filtering,
        favourites and personalised movie
        collections.
      </Typography>

      <Box
        sx={{
          maxWidth: 500,
          margin: "0 auto 4rem",
          textAlign: "left",
        }}
      >
        {benefits.map((benefit) => (
          <Typography
            key={benefit}
            variant="body1"
            sx={{ marginBottom: 1 }}
          >
            ✓ {benefit}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          size="large"
        >
          Create Account
        </Button>

        <Button
          component={Link}
          to="/login"
          variant="outlined"
          size="large"
        >
          Log In
        </Button>

        <Button
          component={Link}
          to="/movies"
          variant="text"
          size="large"
        >
          Explore Movies
        </Button>
      </Box>
    </Paper>
  );
};

export default LandingPage;