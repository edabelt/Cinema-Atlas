import React, { useContext } from "react";
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const displayName =
    user?.user_metadata.full_name ||
    user?.user_metadata.name ||
    user?.email?.split("@")[0];

  const dashboardOptions = [
    {
      title: "Discover Movies",
      description:
        "Browse and filter popular movies.",
      path: "/movies",
    },
    {
      title: "Upcoming Movies",
      description:
        "Discover movies coming soon.",
      path: "/movies/upcoming",
    },
    {
      title: "Popular Actors",
      description:
        "Explore and filter popular actors.",
      path: "/actors",
    },
    {
      title: "Favourite Movies",
      description:
        "View your saved movies.",
      path: "/movies/favourites",
    },
    {
      title: "Favourite Actors",
      description:
        "View your saved actors.",
      path: "/actors/favourites",
    },
    {
      title: "My Playlists",
      description:
        "Create and manage themed movie collections.",
      path: "/movies/playlists",
    },
  ];

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Typography variant="h3" gutterBottom>
        Hello, {displayName}
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ marginBottom: 5 }}
      >
        Welcome to your DaddyMovies dashboard.
      </Typography>

      <Grid
        container
        columnSpacing={3}
        rowSpacing={4}
      >
        {dashboardOptions.map((option) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={option.title}
            sx={{ display: "flex" }}
          >
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                minHeight: 190,
                padding: 3,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
              >
                {option.title}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  flexGrow: 1,
                  marginBottom: 3,
                }}
              >
                {option.description}
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(option.path)
                }
              >
                Open
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;