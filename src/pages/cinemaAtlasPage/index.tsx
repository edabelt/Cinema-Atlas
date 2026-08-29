import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useLocation } from "react-router-dom";

import AtlasMethodology from "../../components/atlasMethodology";
import CinemaWorldMap, { CinemaCountry } from "../../components/cinemaWorldMap";
import CountryComparisonChart from "../../components/countryComparisonChart";
import CountryComparisonControl from "../../components/countryComparisonControl";
import GenreExplorationViews from "../../components/genreExplorationViews";
import ThemeConstellation from "../../components/themeConstellation";
import ThemeEvidencePanel from "../../components/themeEvidencePanel";

import { useCountryGenreData } from "../../hooks/useCountryGenreData";
import { useGenreThemeData } from "../../hooks/useGenreThemeData";

import type { AtlasMovie } from "../../types/cinemaAtlas";

interface StoredAtlasState {
  selectedCountry: CinemaCountry | null;
  comparisonCountry: CinemaCountry | null;
  selectedGenre: string;
  selectedTheme: string;
  selectedMovie: AtlasMovie | null;
}

interface AtlasLocationState {
  restoreAtlas?: boolean;
}

const atlasStorageKey = "daddyMoviesCinemaAtlasState";

const emptyAtlasState: StoredAtlasState = {
  selectedCountry: null,
  comparisonCountry: null,
  selectedGenre: "",
  selectedTheme: "",
  selectedMovie: null,
};

const readStoredAtlasState = (shouldRestore: boolean): StoredAtlasState => {
  if (!shouldRestore) {
    sessionStorage.removeItem(atlasStorageKey);

    return emptyAtlasState;
  }

  try {
    const storedState = sessionStorage.getItem(atlasStorageKey);

    if (!storedState) {
      return emptyAtlasState;
    }

    const parsedState = JSON.parse(storedState) as Partial<StoredAtlasState>;

    return {
      selectedCountry: parsedState.selectedCountry ?? null,
      comparisonCountry: parsedState.comparisonCountry ?? null,
      selectedGenre: parsedState.selectedGenre ?? "",
      selectedTheme: parsedState.selectedTheme ?? "",
      selectedMovie: parsedState.selectedMovie ?? null,
    };
  } catch {
    sessionStorage.removeItem(atlasStorageKey);

    return emptyAtlasState;
  }
};

const CinemaAtlasPage: React.FC = () => {
  const location = useLocation();

  const locationState = location.state as AtlasLocationState | null;

  const shouldRestoreAtlas = locationState?.restoreAtlas === true;

  const [storedAtlasState] = useState(() =>
    readStoredAtlasState(shouldRestoreAtlas),
  );

  const [selectedCountry, setSelectedCountry] = useState<CinemaCountry | null>(
    storedAtlasState.selectedCountry,
  );

  const [comparisonCountry, setComparisonCountry] =
    useState<CinemaCountry | null>(storedAtlasState.comparisonCountry);

  const [selectedGenre, setSelectedGenre] = useState(
    storedAtlasState.selectedGenre,
  );

  const [selectedTheme, setSelectedTheme] = useState(
    storedAtlasState.selectedTheme,
  );

  const [selectedMovie, setSelectedMovie] = useState<AtlasMovie | null>(
    storedAtlasState.selectedMovie,
  );

  const mapSectionRef = useRef<HTMLDivElement | null>(null);

  const genreSectionRef = useRef<HTMLDivElement | null>(null);

  const themeSectionRef = useRef<HTMLDivElement | null>(null);

  const evidenceSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (section: React.RefObject<HTMLDivElement>) => {
    window.requestAnimationFrame(() => {
      section.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const { data, isLoading, isError, error } = useCountryGenreData(
    selectedCountry?.tmdbCode ?? "",
    selectedCountry?.name ?? "",
  );

  const {
    data: comparisonData,
    isFetching: isComparisonLoading,
    isError: isComparisonError,
    error: comparisonError,
  } = useCountryGenreData(
    comparisonCountry?.tmdbCode ?? "",
    comparisonCountry?.name ?? "",
  );

  const {
    data: themeData,
    isLoading: isThemeLoading,
    isError: isThemeError,
    error: themeError,
  } = useGenreThemeData(data, selectedGenre);

  useEffect(() => {
    const atlasState: StoredAtlasState = {
      selectedCountry,
      comparisonCountry,
      selectedGenre,
      selectedTheme,
      selectedMovie,
    };

    sessionStorage.setItem(atlasStorageKey, JSON.stringify(atlasState));
  }, [
    selectedCountry,
    comparisonCountry,
    selectedGenre,
    selectedTheme,
    selectedMovie,
  ]);

  useEffect(() => {
    if (selectedCountry && data && !isLoading) {
      scrollToSection(genreSectionRef);
    }
  }, [selectedCountry, data, isLoading]);

  useEffect(() => {
    if (selectedGenre && themeData && !isThemeLoading) {
      scrollToSection(themeSectionRef);
    }
  }, [selectedGenre, themeData, isThemeLoading]);

  useEffect(() => {
    if (selectedTheme && themeData) {
      scrollToSection(evidenceSectionRef);
    }
  }, [selectedTheme, themeData]);

  const handleResetExploration = () => {
    setSelectedCountry(null);
    setComparisonCountry(null);
    setSelectedGenre("");
    setSelectedTheme("");
    setSelectedMovie(null);

    sessionStorage.removeItem(atlasStorageKey);

    scrollToSection(mapSectionRef);
  };

  const handleCountrySelection = (country: CinemaCountry) => {
    setSelectedCountry(country);

    if (comparisonCountry?.tmdbCode === country.tmdbCode) {
      setComparisonCountry(null);
    }

    setSelectedGenre("");
    setSelectedTheme("");
    setSelectedMovie(null);

    window.setTimeout(() => {
      scrollToSection(genreSectionRef);
    }, 800);
  };

  const handleGenreSelection = (genre: string) => {
    setSelectedGenre(genre);
    setSelectedTheme("");
    setSelectedMovie(null);
  };

  const handleThemeSelection = (theme: string) => {
    setSelectedTheme(theme);
    setSelectedMovie(null);
  };

  const handleMovieSelection = (movie: AtlasMovie) => {
    setSelectedMovie(movie);
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        color: "#f7f7f7",
        background:
          "radial-gradient(circle at top left, #243352 0%, #101522 38%, #080a0f 100%)",
        py: {
          xs: 5,
          md: 8,
        },
      }}
    >
      <Container maxWidth="xl">
        <Typography
          component="p"
          sx={{
            color: "#e6b566",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Cinema Atlas Visual Analytics
        </Typography>

        <Typography
          component="h1"
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Cinema Atlas
        </Typography>

        <Typography
          sx={{
            color: "#bcc4d4",
            maxWidth: 720,
            fontSize: {
              xs: "1rem",
              md: "1.2rem",
            },
          }}
        >
          Explore how genres and thematic indicators travel across
          film-producing countries, from global patterns to individual movies.
        </Typography>

        <Box
          component="nav"
          aria-label="Current analytical path"
          sx={{
            position: "sticky",
            top: {
              xs: 56,
              sm: 64,
            },
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mt: 4,
            mb: 2,
            px: 2,
            py: 1.5,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 3,
            backgroundColor: "rgba(8,10,15,0.92)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.24)",
          }}
        >
          <Chip
            label="World"
            aria-label="Reset the Cinema Atlas exploration"
            onClick={handleResetExploration}
            sx={{
              color: "#111722",
              backgroundColor: "#f0b35a",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#ffc56f",
              },
            }}
          />

          <Typography aria-hidden="true" sx={{ color: "#768198" }}>
            →
          </Typography>

          <Chip
            label={selectedCountry?.name ?? "Select country"}
            onClick={
              selectedCountry ? () => scrollToSection(mapSectionRef) : undefined
            }
            variant="outlined"
            sx={{
              color: "#f7f7f7",
              borderColor: selectedCountry
                ? "#5b8def"
                : "rgba(255,255,255,0.22)",
              cursor: selectedCountry ? "pointer" : "default",
            }}
          />

          <Typography aria-hidden="true" sx={{ color: "#768198" }}>
            →
          </Typography>

          <Chip
            label={selectedGenre || "Select genre"}
            disabled={!selectedGenre}
            onClick={
              selectedGenre ? () => scrollToSection(genreSectionRef) : undefined
            }
            variant="outlined"
            sx={{
              color: selectedGenre ? "#f7f7f7" : "#768198",
              borderColor: selectedGenre ? "#f0b35a" : "rgba(255,255,255,0.12)",
              cursor: selectedGenre ? "pointer" : "default",
            }}
          />

          <Typography aria-hidden="true" sx={{ color: "#768198" }}>
            →
          </Typography>

          <Chip
            label={selectedTheme || "Select theme"}
            disabled={!selectedTheme}
            onClick={
              selectedTheme ? () => scrollToSection(themeSectionRef) : undefined
            }
            variant="outlined"
            sx={{
              color: selectedTheme ? "#f7f7f7" : "#768198",
              borderColor: selectedTheme ? "#78c6a3" : "rgba(255,255,255,0.12)",
              cursor: selectedTheme ? "pointer" : "default",
            }}
          />

          <Typography aria-hidden="true" sx={{ color: "#768198" }}>
            →
          </Typography>

          <Chip
            label={selectedMovie?.title || "Select film"}
            disabled={!selectedMovie}
            onClick={
              selectedMovie
                ? () => scrollToSection(evidenceSectionRef)
                : undefined
            }
            variant="outlined"
            sx={{
              color: selectedMovie ? "#f7f7f7" : "#768198",
              borderColor: selectedMovie ? "#5b8def" : "rgba(255,255,255,0.12)",
              cursor: selectedMovie ? "pointer" : "default",
              maxWidth: {
                xs: 180,
                md: 300,
              },
            }}
          />
        </Box>

        <Box
          ref={mapSectionRef}
          sx={{
            scrollMarginTop: {
              xs: "145px",
              md: "130px",
            },
          }}
        >
          <CinemaWorldMap
            selectedCountry={selectedCountry?.tmdbCode ?? ""}
            onSelectCountry={handleCountrySelection}
          />
        </Box>

        {selectedCountry && isLoading && (
          <Box
            role="status"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              py: 8,
            }}
          >
            <CircularProgress sx={{ color: "#f0b35a" }} />

            <Typography>
              Building the film dataset for {selectedCountry.name}…
            </Typography>
          </Box>
        )}

        {selectedCountry && isError && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error?.message ?? "Unable to load the country dataset."}
          </Alert>
        )}

        {selectedCountry && data && (
          <>
            <CountryComparisonControl
              primaryCountry={selectedCountry}
              comparisonCountry={comparisonCountry}
              onSelectCountry={setComparisonCountry}
              onClearComparison={() => setComparisonCountry(null)}
            />

            {comparisonCountry && isComparisonLoading && (
              <Box
                role="status"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  py: 4,
                }}
              >
                <CircularProgress
                  size={28}
                  sx={{
                    color: "#78c6a3",
                  }}
                />

                <Typography>
                  Building comparison dataset for {comparisonCountry.name}…
                </Typography>
              </Box>
            )}

            {comparisonCountry && isComparisonError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {comparisonError?.message ??
                  "Unable to load the comparison dataset."}
              </Alert>
            )}

            {comparisonCountry &&
              comparisonData &&
              comparisonData.countryCode === comparisonCountry.tmdbCode && (
                <CountryComparisonChart
                  primaryData={data}
                  comparisonData={comparisonData}
                  onSelectGenre={handleGenreSelection}
                />
              )}

            <Box
              ref={genreSectionRef}
              sx={{
                scrollMarginTop: {
                  xs: "145px",
                  md: "130px",
                },
              }}
            >
              <GenreExplorationViews
                data={data}
                selectedGenre={selectedGenre}
                onSelectGenre={handleGenreSelection}
              />
            </Box>

            {selectedGenre && isThemeLoading && (
              <Box
                role="status"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                  py: 7,
                }}
              >
                <CircularProgress
                  sx={{
                    color: "#78c6a3",
                  }}
                />

                <Typography>
                  Extracting thematic indicators for {selectedGenre}…
                </Typography>
              </Box>
            )}

            {selectedGenre && isThemeError && (
              <Alert severity="error" sx={{ mt: 4 }}>
                {themeError?.message ?? "Unable to load thematic indicators."}
              </Alert>
            )}

            {themeData && (
              <Box
                ref={themeSectionRef}
                sx={{
                  scrollMarginTop: {
                    xs: "145px",
                    md: "130px",
                  },
                }}
              >
                <ThemeConstellation
                  data={themeData}
                  selectedTheme={selectedTheme}
                  onSelectTheme={handleThemeSelection}
                />
              </Box>
            )}

            {themeData && selectedTheme && (
              <Box
                ref={evidenceSectionRef}
                sx={{
                  scrollMarginTop: {
                    xs: "145px",
                    md: "130px",
                  },
                }}
              >
                <ThemeEvidencePanel
                  data={themeData}
                  selectedTheme={selectedTheme}
                  onSelectMovie={handleMovieSelection}
                />
              </Box>
            )}

            <Box
              sx={{
                mt: 3,
                p: 3,
                borderLeft: "3px solid #f0b35a",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <Typography component="h2" variant="h6" sx={{ fontWeight: 600 }}>
                Dataset currently in view
              </Typography>

              <Typography
                sx={{
                  color: "#aeb8ca",
                  mt: 1,
                }}
              >
                {data.movies.length} popular films from {data.countryName},
                sampled across complete release years from 2018 to 2025.
              </Typography>

              {comparisonData &&
                comparisonCountry &&
                comparisonData.countryCode === comparisonCountry.tmdbCode && (
                  <Typography
                    sx={{
                      color: "#aeb8ca",
                      mt: 1,
                    }}
                  >
                    The comparison adds {comparisonData.movies.length} films
                    from {comparisonData.countryName} across the same release
                    period.
                  </Typography>
                )}

              {themeData && (
                <Typography
                  sx={{
                    color: "#aeb8ca",
                    mt: 1,
                  }}
                >
                  The thematic constellation uses up to{" "}
                  {themeData.movies.length} prominent {selectedGenre} films and
                  displays the {themeData.themes.length} most frequent TMDB
                  keyword indicators.
                </Typography>
              )}
            </Box>

            <AtlasMethodology />

            <Box
              component="nav"
              aria-label="Cinema Atlas page actions"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 4,
              }}
            >
              <Chip
                label="↑ Back to top"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
                sx={{
                  px: 1,
                  color: "#f7f7f7",
                  border: "1px solid rgba(255,255,255,0.28)",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#78c6a3",
                    backgroundColor: "rgba(120,198,163,0.1)",
                  },
                }}
              />

              <Chip
                label="Reset Atlas"
                onClick={handleResetExploration}
                sx={{
                  px: 1,
                  color: "#111722",
                  backgroundColor: "#f0b35a",
                  fontWeight: 600,
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#ffc66f",
                  },
                }}
              />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default CinemaAtlasPage;
