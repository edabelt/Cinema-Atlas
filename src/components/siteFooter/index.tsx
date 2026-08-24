import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const SiteFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "primary.main",
        color: "primary.contrastText",
        textAlign: "center",
        padding: 3,
        marginTop: 4,
      }}
    >
      <Typography variant="body1">
        DaddyMovies
      </Typography>

      <Typography variant="body2">
        Discover movies, actors and personalised
        collections.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: 1 }}>
        Movie data provided by{" "}
        <Link
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="always"
        >
          TMDB
        </Link>
        .
      </Typography>

      <Typography variant="body2" sx={{ marginTop: 1 }}>
        Built by edabelt
      </Typography>

      <Typography
        variant="caption"
        sx={{ display: "block", marginTop: 1 }}
      >
        © {new Date().getFullYear()} TMDB Client
      </Typography>
    </Box>
  );
};

export default SiteFooter;