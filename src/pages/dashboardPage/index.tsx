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
      title: "Cinema Atlas",
      description:
        "Explore geographic, genre and thematic patterns through interactive visualisations.",
      path: "/cinema-atlas",
      featured: true,
    },
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
        Welcome to your Cinema Atlas dashboard.
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
            md={option.featured ? 12 : 4}
            key={option.title}
            sx={{ display: "flex" }}
          >
            <Paper
              elevation={option.featured ? 6 : 3}
              sx={{
                width: "100%",
                minHeight: option.featured
                  ? 220
                  : 190,
                padding: 3,
                display: "flex",
                flexDirection: "column",
                color: option.featured
                  ? "#ffffff"
                  : "inherit",
                background: option.featured
                  ? "linear-gradient(135deg, #17233d 0%, #090e18 100%)"
                  : undefined,
                border: option.featured
                  ? "1px solid rgba(246, 181, 80, 0.45)"
                  : undefined,
              }}
            >
              {option.featured && (
                <Typography
                  variant="overline"
                  sx={{
                    color: "#f6b550",
                    letterSpacing: "0.18em",
                    marginBottom: 1,
                  }}
                >
                  Visual analytics
                </Typography>
              )}

              <Typography
                variant={
                  option.featured ? "h4" : "h5"
                }
                gutterBottom
              >
                {option.title}
              </Typography>

              <Typography
                sx={{
                  flexGrow: 1,
                  marginBottom: 3,
                  color: option.featured
                    ? "rgba(255,255,255,0.72)"
                    : "text.secondary",
                  maxWidth: option.featured
                    ? 650
                    : undefined,
                }}
              >
                {option.description}
              </Typography>

              <Button
                variant="contained"
                onClick={() =>
                  navigate(option.path)
                }
                sx={{
                  alignSelf: "flex-start",
                  ...(option.featured && {
                    backgroundColor: "#f6b550",
                    color: "#111827",
                    "&:hover": {
                      backgroundColor: "#ffc766",
                    },
                  }),
                }}
              >
                {option.featured
                  ? "Explore the Atlas"
                  : "Open"}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardPage;