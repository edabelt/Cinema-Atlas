import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const SiteFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        background:
          "linear-gradient(180deg, #0b101c 0%, #131d31 38%, #1d2c4a 100%)",
        color: "#ffffff",
        textAlign: "center",
        padding: 3,
        marginTop: 0,
        borderTop:
          "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <Typography
        variant="body1"
        sx={{ fontWeight: 600 }}
      >
        Cinema Atlas
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: "#c6cede" }}
      >
        Discover movies, actors and personalised
        collections.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          marginTop: 1,
          color: "#c6cede",
        }}
      >
        Movie data provided by{" "}
        <Link
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "inherit",
            textDecorationColor:
              "rgba(255,255,255,0.6)",
          }}
        >
          TMDB
        </Link>
        .
      </Typography>

      <Typography
        variant="body2"
        sx={{
          marginTop: 1,
          color: "#c6cede",
        }}
      >
        Built by{" "}
        <Link
          href="https://github.com/edabelt"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit edabelt on GitHub"
          sx={{
            color: "#f0b35a",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": {
              color: "#ffd28d",
              textDecoration: "underline",
            },
          }}
        >
          edabelt
        </Link>
      </Typography>

      <Typography
        variant="caption"
        sx={{
          display: "block",
          marginTop: 1,
          color: "#929db2",
        }}
      >
        © {new Date().getFullYear()} Cinema Atlas
      </Typography>
    </Box>
  );
};

export default SiteFooter;