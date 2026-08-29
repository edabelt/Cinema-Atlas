import React, {
  useRef,
  useState,
} from "react";
import {
  Box,
  ButtonBase,
  Chip,
  Typography,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import TimelineIcon from "@mui/icons-material/Timeline";
import StyleIcon from "@mui/icons-material/Style";

import GenreDealer from "../genreDealer";
import GenreTrendChart from "../genreTrendChart";

import { CountryGenreDataset } from "../../types/cinemaAtlas";

interface GenreExplorationViewsProps {
  data: CountryGenreDataset;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

type GenreView =
  | "trends"
  | "dealer";

interface ViewOption {
  id: GenreView;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  accentColour: string;
  interactive?: boolean;
}

const viewOptions: ViewOption[] = [
  {
    id: "trends",
    title: "Genre Trends",
    description:
      "Compare precise yearly values and trace how genre prevalence changes over time.",
    action: "Open analytical chart",
    icon: (
      <ShowChartIcon
        sx={{ fontSize: 36 }}
      />
    ),
    accentColour: "#5b8def",
  },
  {
    id: "dealer",
    title: "Genre Dealer",
    description:
      "Watch films arrive year by year and move into evolving genre communities.",
    action: "Start interactive experience",
    icon: (
      <StyleIcon
        sx={{ fontSize: 36 }}
      />
    ),
    accentColour: "#f0b35a",
    interactive: true,
  },
];

const GenreExplorationViews: React.FC<
  GenreExplorationViewsProps
> = ({
  data,
  selectedGenre,
  onSelectGenre,
}) => {
  const [activeView, setActiveView] =
    useState<GenreView>("trends");

  const visualisationRef =
    useRef<HTMLDivElement | null>(null);

  const selectView = (
    nextView: GenreView
  ) => {
    setActiveView(nextView);

    window.setTimeout(() => {
      visualisationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        component="section"
        aria-labelledby="genre-view-heading"
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          border:
            "1px solid rgba(255,255,255,0.12)",
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(20,28,45,0.96) 0%, rgba(9,13,22,0.96) 100%)",
          boxShadow:
            "0 18px 44px rgba(0,0,0,0.22)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: {
              xs: "flex-start",
              md: "center",
            },
            justifyContent:
              "space-between",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              component="p"
              sx={{
                color: "#f0b35a",
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                fontSize: "0.75rem",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Choose your exploration
            </Typography>

            <Typography
              id="genre-view-heading"
              component="h2"
              variant="h5"
              sx={{ fontWeight: 700 }}
            >
              How would you like to explore{" "}
              {data.countryName}?
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#9faabe",
              maxWidth: 420,
              fontSize: "0.9rem",
            }}
          >
            Select one of the two visual
            perspectives below.
          </Typography>
        </Box>

        <Box
          role="tablist"
          aria-label="Genre visualisation view"
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {viewOptions.map((option) => {
            const isSelected =
              activeView === option.id;

            return (
              <ButtonBase
                key={option.id}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${option.id}-visualisation`}
                onClick={() =>
                  selectView(option.id)
                }
                sx={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  minHeight: 190,
                  p: {
                    xs: 2.5,
                    md: 3,
                  },
                  overflow: "hidden",
                  textAlign: "left",
                  color: "#f7f7f7",
                  border: isSelected
                    ? `2px solid ${option.accentColour}`
                    : "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 3,
                  background: isSelected
                    ? `linear-gradient(
                        135deg,
                        ${option.accentColour}24 0%,
                        rgba(15,21,34,0.96) 68%
                      )`
                    : "rgba(255,255,255,0.035)",
                  boxShadow: isSelected
                    ? `0 14px 36px ${option.accentColour}1f`
                    : "none",
                  transition:
                    "transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform:
                      "translateY(-4px)",
                    borderColor:
                      option.accentColour,
                    background: `linear-gradient(
                      135deg,
                      ${option.accentColour}20 0%,
                      rgba(15,21,34,0.98) 70%
                    )`,
                    boxShadow: `0 16px 38px ${option.accentColour}1c`,
                  },
                  "&:focus-visible": {
                    outline: `3px solid ${option.accentColour}`,
                    outlineOffset: 3,
                  },
                }}
              >
                <Box
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    right: -35,
                    bottom: -45,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background:
                      option.accentColour,
                    opacity: isSelected
                      ? 0.11
                      : 0.05,
                  }}
                />

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems:
                      "flex-start",
                    justifyContent:
                      "space-between",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      width: 62,
                      height: 62,
                      flexShrink: 0,
                      color:
                        option.accentColour,
                      border: `1px solid ${option.accentColour}66`,
                      borderRadius: 2.5,
                      background:
                        `${option.accentColour}14`,
                    }}
                  >
                    {option.icon}
                  </Box>

                  {option.interactive && (
                    <Chip
                      icon={
                        <PlayCircleOutlineIcon />
                      }
                      label="Interactive"
                      size="small"
                      sx={{
                        color: "#111722",
                        backgroundColor:
                          "#f0b35a",
                        fontWeight: 700,
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.05em",
                        "& .MuiChip-icon":
                          {
                            color:
                              "#111722",
                          },
                      }}
                    />
                  )}

                  {!option.interactive &&
                    isSelected && (
                      <Chip
                        label="Selected"
                        size="small"
                        sx={{
                          color: "#dce7ff",
                          border:
                            "1px solid rgba(91,141,239,0.55)",
                          backgroundColor:
                            "rgba(91,141,239,0.14)",
                        }}
                      />
                    )}
                </Box>

                <Typography
                  component="h3"
                  variant="h5"
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    mt: 2,
                    fontWeight: 700,
                  }}
                >
                  {option.title}
                </Typography>

                <Typography
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    color: "#aeb8ca",
                    mt: 0.75,
                    maxWidth: 520,
                    lineHeight: 1.55,
                  }}
                >
                  {option.description}
                </Typography>

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2,
                    color:
                      option.accentColour,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {option.id ===
                  "dealer" ? (
                    <PlayCircleOutlineIcon
                      fontSize="small"
                    />
                  ) : (
                    <TimelineIcon
                      fontSize="small"
                    />
                  )}

                  {isSelected
                    ? "Currently open"
                    : option.action}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      <Box
        ref={visualisationRef}
        id={`${activeView}-visualisation`}
        role="tabpanel"
        sx={{
          scrollMarginTop: {
            xs: "145px",
            md: "130px",
          },
        }}
      >
        {activeView === "trends" ? (
          <GenreTrendChart
            data={data}
            selectedGenre={
              selectedGenre
            }
            onSelectGenre={
              onSelectGenre
            }
          />
        ) : (
          <GenreDealer
            data={data}
            onSelectGenre={
              onSelectGenre
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default GenreExplorationViews;