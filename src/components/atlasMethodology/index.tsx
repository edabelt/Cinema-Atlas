import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const AtlasMethodology: React.FC = () => {
  return (
    <Accordion
      sx={{
        mt: 3,
        color: "#f7f7f7",
        border:
          "1px solid rgba(255,255,255,0.12)",
        borderRadius: "16px !important",
        background:
          "rgba(10,14,24,0.82)",
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: "#f0b35a" }}
          />
        }
        aria-controls="atlas-methodology-content"
        id="atlas-methodology-header"
      >
        <Box>
          <Typography
            sx={{
              color: "#f0b35a",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontSize: "0.78rem",
            }}
          >
            Research transparency
          </Typography>

          <Typography
            component="h2"
            variant="h6"
            sx={{ fontWeight: 600 }}
          >
            Methods, provenance and limitations
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          component="dl"
          sx={{
            m: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "200px 1fr",
            },
            gap: {
              xs: 1,
              md: 2,
            },
          }}
        >
          <Typography
            component="dt"
            sx={{
              color: "#78c6a3",
              fontWeight: 600,
            }}
          >
            Data source
          </Typography>

          <Typography
            component="dd"
            sx={{
              m: 0,
              color: "#b8c1d1",
            }}
          >
            Film metadata, genres and keywords
            are retrieved from The Movie Database
            API.
          </Typography>

          <Typography
            component="dt"
            sx={{
              color: "#78c6a3",
              fontWeight: 600,
            }}
          >
            Sampling
          </Typography>

          <Typography
            component="dd"
            sx={{
              m: 0,
              color: "#b8c1d1",
            }}
          >
            The prototype retrieves one
            popularity-ranked results page for
            each country and complete release year
            from 2018 to 2025.
          </Typography>

          <Typography
            component="dt"
            sx={{
              color: "#78c6a3",
              fontWeight: 600,
            }}
          >
            Genre measure
          </Typography>

          <Typography
            component="dd"
            sx={{
              m: 0,
              color: "#b8c1d1",
            }}
          >
            Genre prevalence represents the
            percentage of sampled films carrying
            each genre label. Films can have
            multiple genres, so values do not sum
            to 100%.
          </Typography>

          <Typography
            component="dt"
            sx={{
              color: "#78c6a3",
              fontWeight: 600,
            }}
          >
            Theme proxy
          </Typography>

          <Typography
            component="dd"
            sx={{
              m: 0,
              color: "#b8c1d1",
            }}
          >
            Themes are approximated through TMDB
            keywords. They are thematic indicators
            supplied by the dataset, not definitive
            interpretations of a film.
          </Typography>

          <Typography
            component="dt"
            sx={{
              color: "#78c6a3",
              fontWeight: 600,
            }}
          >
            Interpretation
          </Typography>

          <Typography
            component="dd"
            sx={{
              m: 0,
              color: "#b8c1d1",
            }}
          >
            Differences visible between countries
            are exploratory patterns within this
            sample. They should not be treated as
            complete or essential descriptions of
            national cinema or culture.
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default AtlasMethodology;