import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Box,
  Button,
  Drawer,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  AtlasMovie,
  GenreThemeDataset,
} from "../../types/cinemaAtlas";

interface ThemeEvidencePanelProps {
  data: GenreThemeDataset;
  selectedTheme: string;
  onSelectMovie: (
    movie: AtlasMovie
  ) => void;
}

const imageBaseUrl =
  "https://image.tmdb.org/t/p/w342";

const ThemeEvidencePanel: React.FC<
  ThemeEvidencePanelProps
> = ({
  data,
  selectedTheme,
  onSelectMovie,
}) => {
  const navigate = useNavigate();

  const [activeMovie, setActiveMovie] =
    useState<AtlasMovie | null>(null);

  const theme = data.themes.find(
    (item) =>
      item.name === selectedTheme
  );

  const supportingMovies = useMemo(() => {
    if (!theme) {
      return [];
    }

    return data.movies.filter((movie) =>
      theme.movieIds.includes(movie.id)
    );
  }, [data.movies, theme]);

  useEffect(() => {
    setActiveMovie(null);
  }, [selectedTheme]);

  const selectMovie = (
    movie: AtlasMovie
  ) => {
    setActiveMovie(movie);
    onSelectMovie(movie);
  };

  if (!theme) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          mt: 3,
          p: {
            xs: 2,
            md: 3,
          },
          border:
            "1px solid rgba(255,255,255,0.12)",
          borderRadius: 4,
          background:
            "rgba(10,14,24,0.82)",
        }}
      >
        <Typography
          component="p"
          sx={{
            color: "#78c6a3",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Source evidence
        </Typography>

        <Typography
          component="h2"
          variant="h5"
          sx={{
            mt: 0.5,
            fontWeight: 600,
          }}
        >
          Films supporting “{selectedTheme}”
        </Typography>

        <Typography
          sx={{
            color: "#aeb8ca",
            mt: 0.5,
            mb: 2,
            fontSize: "0.95rem",
          }}
        >
          These {supportingMovies.length} films
          contain the selected TMDB keyword.
          Select a film to inspect the evidence
          behind the visual pattern.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            overflowX: "auto",
            overflowY: "hidden",
            pb: 2,
            scrollSnapType: "x mandatory",
            scrollbarColor:
              "#78c6a3 rgba(255,255,255,0.08)",
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-track": {
              background:
                "rgba(255,255,255,0.08)",
              borderRadius: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#78c6a3",
              borderRadius: 4,
            },
          }}
        >
          {supportingMovies.map((movie) => (
            <Box
              component="button"
              type="button"
              key={movie.id}
              onClick={() =>
                selectMovie(movie)
              }
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "82px 1fr",
                gap: 2,
                minWidth: {
                  xs: 270,
                  sm: 310,
                },
                maxWidth: 310,
                minHeight: 150,
                p: 1.5,
                flexShrink: 0,
                scrollSnapAlign: "start",
                textAlign: "left",
                color: "#f7f7f7",
                border:
                  activeMovie?.id ===
                  movie.id
                    ? "1px solid #78c6a3"
                    : "1px solid rgba(255,255,255,0.12)",
                borderRadius: 3,
                background:
                  activeMovie?.id ===
                  movie.id
                    ? "rgba(120,198,163,0.1)"
                    : "rgba(255,255,255,0.035)",
                cursor: "pointer",
                transition:
                  "transform 180ms ease, border-color 180ms ease, background 180ms ease",
                "&:hover": {
                  transform:
                    "translateY(-3px)",
                  borderColor: "#78c6a3",
                  background:
                    "rgba(120,198,163,0.08)",
                },
                "&:focus-visible": {
                  outline:
                    "3px solid #78c6a3",
                  outlineOffset: 2,
                },
              }}
            >
              {movie.poster_path ? (
                <Box
                  component="img"
                  src={`${imageBaseUrl}${movie.poster_path}`}
                  alt=""
                  loading="lazy"
                  sx={{
                    width: 82,
                    height: 123,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
              ) : (
                <Box
                  aria-hidden="true"
                  sx={{
                    width: 82,
                    height: 123,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2,
                    background:
                      "rgba(255,255,255,0.08)",
                    color: "#8490a5",
                  }}
                >
                  No image
                </Box>
              )}

              <Box>
                <Typography
                  component="h3"
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.25,
                  }}
                >
                  {movie.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#aeb8ca",
                    mt: 0.5,
                  }}
                >
                  {movie.release_date?.slice(
                    0,
                    4
                  ) || "Unknown year"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#e6b566",
                    mt: 1,
                  }}
                >
                  Rating{" "}
                  {movie.vote_average.toFixed(
                    1
                  )}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={Boolean(activeMovie)}
        onClose={() =>
          setActiveMovie(null)
        }
        PaperProps={{
          sx: {
            width: {
              xs: "100%",
              sm: 470,
            },
            color: "#f7f7f7",
            background:
              "linear-gradient(180deg, #151d2c 0%, #090c13 100%)",
          },
        }}
      >
        {activeMovie && (
          <Box
            sx={{
              p: {
                xs: 3,
                sm: 4,
              },
            }}
          >
            <Typography
              component="p"
              sx={{
                color: "#78c6a3",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Source evidence
            </Typography>

            <Typography
              component="h2"
              variant="h4"
              sx={{
                mt: 1,
                fontWeight: 700,
              }}
            >
              {activeMovie.title}
            </Typography>

            <Typography
              sx={{
                color: "#aeb8ca",
                mt: 1,
              }}
            >
              {activeMovie.release_date ||
                "Release date unavailable"}{" "}
              · Rating{" "}
              {activeMovie.vote_average.toFixed(
                1
              )}
            </Typography>

            {activeMovie.poster_path && (
              <Box
                component="img"
                src={`${imageBaseUrl}${activeMovie.poster_path}`}
                alt={`Poster for ${activeMovie.title}`}
                sx={{
                  width: "100%",
                  maxHeight: 420,
                  objectFit: "cover",
                  objectPosition: "top",
                  borderRadius: 3,
                  mt: 3,
                }}
              />
            )}

            <Typography
              component="h3"
              variant="h6"
              sx={{
                mt: 3,
                fontWeight: 600,
              }}
            >
              Overview
            </Typography>

            <Typography
              sx={{
                color: "#c7ceda",
                mt: 1,
                lineHeight: 1.7,
              }}
            >
              {activeMovie.overview ||
                "No overview is available for this film."}
            </Typography>

            <Typography
              sx={{
                color: "#8490a5",
                mt: 3,
                fontSize: "0.88rem",
              }}
            >
              This film is included because TMDB
              associates it with the thematic
              indicator “{selectedTheme}”.
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mt: 4,
              }}
            >
              <Button
                variant="contained"
                onClick={() =>
                  navigate(
                    `/movies/${activeMovie.id}`,
                    {
                      state: {
                        fromAtlas: true,
                      },
                    }
                  )
                }
                sx={{
                  backgroundColor:
                    "#f0b35a",
                  color: "#111722",
                  "&:hover": {
                    backgroundColor:
                      "#d99a43",
                  },
                }}
              >
                Open movie page
              </Button>

              <Button
                variant="outlined"
                onClick={() =>
                  setActiveMovie(null)
                }
                sx={{
                  color: "#f7f7f7",
                  borderColor:
                    "rgba(255,255,255,0.3)",
                  "&:hover": {
                    borderColor: "#f7f7f7",
                  },
                }}
              >
                Close
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default ThemeEvidencePanel;