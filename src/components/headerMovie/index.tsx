import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { MovieDetailsProps } from "../../types/interfaces";

interface MovieLocationState {
  fromAtlas?: boolean;
}

const styles = {
  root: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
    padding: 2,
  },

  avatar: {
    backgroundColor: "rgb(255,0,0)",
  },
};

const MovieHeader: React.FC<
  MovieDetailsProps
> = (movie) => {
  const navigate = useNavigate();
  const location = useLocation();

  const locationState =
    location.state as MovieLocationState | null;

  const openedFromAtlas =
    locationState?.fromAtlas === true;

  const favourites = JSON.parse(
    localStorage.getItem("favourites") ||
      "[]"
  );

  const isFavourite = favourites.some(
    (
      favourite:
        | number
        | string
        | MovieDetailsProps
    ) => {
      if (typeof favourite === "object") {
        return (
          Number(favourite.id) ===
          Number(movie.id)
        );
      }

      return (
        Number(favourite) ===
        Number(movie.id)
      );
    }
  );

  const returnToAtlas = () => {
    navigate("/cinema-atlas", {
      state: {
        restoreAtlas: true,
      },
    });
  };

  return (
    <Paper
      component="header"
      sx={styles.root}
    >
      {openedFromAtlas && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={returnToAtlas}
          aria-label="Return to Cinema Atlas"
          sx={{
            position: {
              xs: "static",
              md: "absolute",
            },
            left: {
              md: 24,
            },
            color: "#1976d2",
            whiteSpace: "nowrap",
          }}
        >
          Cinema Atlas
        </Button>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          maxWidth: {
            xs: "100%",
            md: "70%",
          },
        }}
      >
        {isFavourite && (
          <Avatar sx={styles.avatar}>
            <FavoriteIcon />
          </Avatar>
        )}

        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: {
              xs: "center",
              md: "left",
            },
          }}
        >
          {movie.title}

          {movie.homepage && (
            <>
              {" "}

              <Box
                component="a"
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit the official website for ${movie.title}`}
                sx={{
                  display: "inline-flex",
                  verticalAlign: "middle",
                }}
              >
                <HomeIcon
                  color="primary"
                  fontSize="large"
                />
              </Box>
            </>
          )}

          {movie.tagline && (
            <>
              <br />

              <Typography
                component="span"
                sx={{
                  color: "text.secondary",
                  fontSize: {
                    xs: "1rem",
                    md: "1.25rem",
                  },
                }}
              >
                {movie.tagline}
              </Typography>
            </>
          )}
        </Typography>
      </Box>
    </Paper>
  );
};

export default MovieHeader;