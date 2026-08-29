import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ReplayIcon from "@mui/icons-material/Replay";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import LastPageIcon from "@mui/icons-material/LastPage";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";

import { AtlasMovie, CountryGenreDataset } from "../../types/cinemaAtlas";

interface GenreDealerProps {
  data: CountryGenreDataset;
  onSelectGenre: (genre: string) => void;
}

interface DealerGenre {
  id: number;
  name: string;
  colour: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FilmPlacement {
  movie: AtlasMovie;
  primaryGenreId: number;
  matchingGenreIds: number[];
  targetX: number;
  targetY: number;
}

const WIDTH = 1000;
const HEIGHT = 660;
const TIMELINE_Y = 330;
const LANE_WIDTH = 226;
const LANE_HEIGHT = 190;

const colours = [
  "#f0b35a",
  "#5b8def",
  "#78c6a3",
  "#d17b88",
  "#9d8df1",
  "#58b8c9",
  "#d4cf68",
  "#e68a5c",
];

const playbackOptions = [
  { label: "Slow · 2 minutes", value: 120000 },
  { label: "Normal · 75 seconds", value: 75000 },
  { label: "Fast · 45 seconds", value: 45000 },
];

const imageBaseUrl = "https://image.tmdb.org/t/p/w185";

const getReleaseYear = (movie: AtlasMovie) => {
  const year = Number(movie.release_date?.slice(0, 4));
  return Number.isFinite(year) ? year : 0;
};

const GenreDealer: React.FC<GenreDealerProps> = ({ data, onSelectGenre }) => {
  const navigate = useNavigate();
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );

  const years = useMemo(
    () => [...data.years].sort((a, b) => a - b),
    [data.years],
  );
  const firstYear = years[0];
  const finalYear = years[years.length - 1];

  const genres = useMemo<DealerGenre[]>(() => {
    const totals = new Map<number, { name: string; total: number }>();

    data.genreTrends.forEach((trend) => {
      const current = totals.get(trend.genreId);
      totals.set(trend.genreId, {
        name: trend.genreName,
        total: (current?.total ?? 0) + trend.count,
      });
    });

    return [...totals.entries()]
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 8)
      .map(([id, genre], index) => {
        const column = index % 4;
        const row = Math.floor(index / 4);

        return {
          id,
          name: genre.name,
          colour: colours[index],
          x: 20 + column * 245,
          y: row === 0 ? 24 : 446,
          width: LANE_WIDTH,
          height: LANE_HEIGHT,
        };
      });
  }, [data.genreTrends]);

  const genreById = useMemo(
    () => new Map(genres.map((genre) => [genre.id, genre])),
    [genres],
  );

  const placements = useMemo<FilmPlacement[]>(() => {
    const laneCounters = new Map<number, number>();

    return data.movies
      .filter((movie) => {
        const year = getReleaseYear(movie);
        return (
          year >= firstYear &&
          year <= finalYear &&
          movie.genre_ids.some((id) => genreById.has(id))
        );
      })
      .sort((a, b) => {
        const yearDifference = getReleaseYear(a) - getReleaseYear(b);
        return yearDifference || b.popularity - a.popularity;
      })
      .map((movie) => {
        const matchingGenreIds = movie.genre_ids.filter((id) =>
          genreById.has(id),
        );
        const primaryGenreId = matchingGenreIds[0];
        const genre = genreById.get(primaryGenreId)!;
        const laneIndex = laneCounters.get(primaryGenreId) ?? 0;
        laneCounters.set(primaryGenreId, laneIndex + 1);

        const column = laneIndex % 10;
        const row = Math.floor(laneIndex / 10) % 4;

        return {
          movie,
          primaryGenreId,
          matchingGenreIds,
          targetX: genre.x + 18 + column * 20,
          targetY: genre.y + 92 + row * 23,
        };
      });
  }, [data.movies, finalYear, firstYear, genreById]);

  const [revealedCount, setRevealedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackDuration, setPlaybackDuration] = useState(75000);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [hoveredMovieId, setHoveredMovieId] = useState<number | null>(null);

  useEffect(() => {
    setRevealedCount(0);
    setIsPlaying(false);
    setSelectedGenreId(null);
    setHoveredMovieId(null);
  }, [data.countryCode]);

  const intervalDuration = Math.max(
    240,
    playbackDuration / Math.max(placements.length, 1),
  );

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setRevealedCount((count) => {
        if (count >= placements.length) {
          setIsPlaying(false);
          return count;
        }

        return count + 1;
      });
    }, intervalDuration);

    return () => window.clearInterval(interval);
  }, [intervalDuration, isPlaying, placements.length]);

  const visiblePlacements = placements.slice(0, revealedCount);
  const activePlacement =
    revealedCount > 0 ? placements[revealedCount - 1] : null;
  const settledPlacements = activePlacement
    ? visiblePlacements.slice(0, -1)
    : visiblePlacements;

  const currentYear =
    revealedCount > 0
      ? getReleaseYear(placements[revealedCount - 1].movie)
      : firstYear;

  const sourceXForYear = (year: number) => {
    const range = Math.max(finalYear - firstYear, 1);
    return 90 + ((year - firstYear) / range) * 820;
  };

  const visibleCounts = useMemo(() => {
    const counts = new Map<number, number>();
    genres.forEach((genre) => counts.set(genre.id, 0));

    visiblePlacements.forEach((placement) => {
      placement.matchingGenreIds.forEach((genreId) => {
        counts.set(genreId, (counts.get(genreId) ?? 0) + 1);
      });
    });

    return counts;
  }, [genres, visiblePlacements]);

  const hoveredPlacement = placements.find(
    (placement) => placement.movie.id === hoveredMovieId,
  );

  const revealThroughYear = (year: number) => {
    const count = placements.filter(
      (placement) => getReleaseYear(placement.movie) <= year,
    ).length;
    setRevealedCount(count);
    setIsPlaying(false);
  };

  const yearMarks = useMemo(
    () =>
      years.map((year) => ({
        value: placements.filter(
          (placement) => getReleaseYear(placement.movie) <= year,
        ).length,
        label: String(year),
      })),
    [placements, years],
  );

  const handlePlayPause = () => {
    if (revealedCount >= placements.length) {
      setRevealedCount(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((playing) => !playing);
  };

  const handleReplay = () => {
    setRevealedCount(0);
    setIsPlaying(!prefersReducedMotion);
  };

  const currentYearIndex = years.indexOf(currentYear);

  const activeGenreNames = activePlacement
    ? activePlacement.matchingGenreIds
        .map((id) => genreById.get(id)?.name)
        .filter((name): name is string => Boolean(name))
    : [];

  const liveCaption = activePlacement
    ? `Dealing ${revealedCount} of ${placements.length}: ${activePlacement.movie.title} emerges from ${currentYear} and enters ${activeGenreNames.join(
        ", ",
      )}.`
    : revealedCount === 0
      ? "Press Start journey to release the first film from the timeline."
      : `${revealedCount} films have been integrated into the genre landscape through ${currentYear}.`;

  const openMovie = (movie: AtlasMovie) => {
    navigate(`/movies/${movie.id}`, {
      state: { fromAtlas: true },
    });
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: { xs: 2, md: 3 },
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 4,
        background:
          "linear-gradient(145deg, rgba(16,22,36,0.98), rgba(7,10,17,0.98))",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#f0b35a",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            Film-by-film temporal journey
          </Typography>

          <Typography
            component="h2"
            variant="h5"
            sx={{ mt: 0.5, fontWeight: 700 }}
          >
            Genre Dealer: {data.countryName}
          </Typography>

          <Typography sx={{ color: "#aeb8ca", mt: 0.5, maxWidth: 780 }}>
            Time releases each film from its year marker. The film then travels
            into its primary genre while illuminating every related genre.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            label={`${revealedCount} / ${placements.length} films`}
            sx={{ color: "#f7f7f7", background: "rgba(255,255,255,0.07)" }}
          />
          <Chip
            icon={<AutoAwesomeIcon />}
            label={currentYear}
            sx={{
              color: "#111722",
              backgroundColor: "#f0b35a",
              fontWeight: 700,
              "& .MuiChip-icon": { color: "#111722" },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          mt: 2.5,
          p: 2,
          border: "1px solid rgba(240,179,90,0.25)",
          borderRadius: 3,
          background:
            "linear-gradient(110deg, rgba(240,179,90,0.11), rgba(91,141,239,0.07))",
        }}
      >
        <Typography
          sx={{
            color: "#f0b35a",
            fontSize: "0.76rem",
            fontWeight: 700,
            letterSpacing: "0.11em",
            textTransform: "uppercase",
          }}
        >
          Live interpretation
        </Typography>
        <Typography aria-live="polite" sx={{ color: "#e1e6ef", mt: 0.4 }}>
          {liveCaption}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 2,
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            xl: "auto minmax(320px, 1fr) 190px",
          },
          alignItems: "center",
          gap: 2,
          p: 2,
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
          background: "rgba(255,255,255,0.025)",
        }}
      >
        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          <Tooltip title="Previous year">
            <span>
              <IconButton
                disabled={currentYearIndex <= 0}
                onClick={() => revealThroughYear(years[currentYearIndex - 1])}
                sx={{
                  color: "#f7f7f7",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <SkipPreviousIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Button
            variant="contained"
            onClick={handlePlayPause}
            startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{
              minWidth: 145,
              color: "#111722",
              backgroundColor: "#f0b35a",
              "&:hover": { backgroundColor: "#ffc66f" },
            }}
          >
            {isPlaying
              ? "Pause"
              : revealedCount >= placements.length
                ? "Play again"
                : revealedCount === 0
                  ? "Start journey"
                  : "Continue"}
          </Button>

          <Tooltip title="Next year">
            <span>
              <IconButton
                disabled={currentYearIndex >= years.length - 1}
                onClick={() => revealThroughYear(years[currentYearIndex + 1])}
                sx={{
                  color: "#f7f7f7",
                  border: "1px solid rgba(255,255,255,0.18)",
                }}
              >
                <SkipNextIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Restart">
            <IconButton
              onClick={handleReplay}
              sx={{
                color: "#f7f7f7",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Show all films">
            <IconButton
              onClick={() => {
                setRevealedCount(placements.length);
                setIsPlaying(false);
              }}
              sx={{
                color: "#78c6a3",
                border: "1px solid rgba(120,198,163,0.35)",
              }}
            >
              <LastPageIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Slider
          value={revealedCount}
          min={0}
          max={Math.max(placements.length, 1)}
          step={1}
          marks={yearMarks}
          aria-label="Film-by-film timeline"
          onChange={(_event, value) => {
            setRevealedCount(value as number);
            setIsPlaying(false);
          }}
          sx={{
            color: "#f0b35a",
            "& .MuiSlider-markLabel": { color: "#8f9aae", fontSize: "0.68rem" },
          }}
        />

        <FormControl size="small" fullWidth>
          <InputLabel id="dealer-duration-label" sx={{ color: "#aeb8ca" }}>
            Journey duration
          </InputLabel>
          <Select
            labelId="dealer-duration-label"
            value={playbackDuration}
            label="Journey duration"
            onChange={(event) =>
              setPlaybackDuration(Number(event.target.value))
            }
            sx={{
              color: "#f7f7f7",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.24)",
              },
              "& .MuiSvgIcon-root": { color: "#aeb8ca" },
            }}
          >
            {playbackOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        sx={{
          mt: 2.5,
          width: "100%",
          height: { xs: 520, md: 650 },
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 3,
          overflow: "hidden",
          background:
            "radial-gradient(circle at center, rgba(91,141,239,0.11), rgba(5,8,14,0.98) 67%)",
        }}
      >
        <Box
          component="svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Film-by-film genre timeline for ${data.countryName}`}
          sx={{ display: "block", width: "100%", height: "100%" }}
        >
          <defs>
            <filter
              id="card-shadow"
              x="-60%"
              y="-60%"
              width="220%"
              height="220%"
            >
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="5"
                floodColor="#000"
                floodOpacity="0.55"
              />
            </filter>
          </defs>

          {genres.map((genre) => {
            const count = visibleCounts.get(genre.id) ?? 0;
            const isSelected = selectedGenreId === genre.id;
            const isConnected =
              activePlacement?.matchingGenreIds.includes(genre.id) ||
              hoveredPlacement?.matchingGenreIds.includes(genre.id);

            return (
              <g
                key={genre.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelectedGenreId(genre.id);
                  onSelectGenre(genre.name);
                }}
                style={{ cursor: "pointer", outline: "none" }}
              >
                <rect
                  x={genre.x}
                  y={genre.y}
                  width={genre.width}
                  height={genre.height}
                  rx={18}
                  fill={
                    isSelected || isConnected ? `${genre.colour}28` : "#0c1220"
                  }
                  stroke={genre.colour}
                  strokeWidth={isSelected || isConnected ? 4 : 1.5}
                  strokeOpacity={isSelected || isConnected ? 1 : 0.5}
                />
                <rect
                  x={genre.x}
                  y={genre.y}
                  width={genre.width}
                  height={6}
                  rx={3}
                  fill={genre.colour}
                />
                <text
                  x={genre.x + 16}
                  y={genre.y + 35}
                  fill="#fff"
                  fontSize={17}
                  fontWeight={700}
                >
                  {genre.name}
                </text>
                <text
                  x={genre.x + 16}
                  y={genre.y + 57}
                  fill={genre.colour}
                  fontSize={12}
                  fontWeight={600}
                >
                  {count} films
                </text>
              </g>
            );
          })}

          <line
            x1={75}
            y1={TIMELINE_Y}
            x2={925}
            y2={TIMELINE_Y}
            stroke="#53627c"
            strokeWidth={4}
            strokeLinecap="round"
          />

          {years.map((year) => {
            const x = sourceXForYear(year);
            const isCurrent = year === currentYear;
            return (
              <g key={year}>
                <circle
                  cx={x}
                  cy={TIMELINE_Y}
                  r={isCurrent ? 10 : 6}
                  fill={isCurrent ? "#f0b35a" : "#26334b"}
                  stroke={isCurrent ? "#ffe0aa" : "#8e9bb0"}
                  strokeWidth={2}
                />
                <text
                  x={x}
                  y={TIMELINE_Y + 31}
                  textAnchor="middle"
                  fill={isCurrent ? "#f0b35a" : "#8995a9"}
                  fontSize={12}
                  fontWeight={isCurrent ? 700 : 500}
                >
                  {year}
                </text>
              </g>
            );
          })}

          <text
            x={500}
            y={TIMELINE_Y - 25}
            textAnchor="middle"
            fill="#aeb8ca"
            fontSize={13}
            letterSpacing={2}
          >
            RELEASE TIMELINE
          </text>

          {settledPlacements.map((placement) => {
            const genre = genreById.get(placement.primaryGenreId)!;
            const isDimmed =
              selectedGenreId !== null &&
              !placement.matchingGenreIds.includes(selectedGenreId);

            return (
              <g
                key={placement.movie.id}
                transform={`translate(${placement.targetX} ${placement.targetY})`}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setHoveredMovieId(placement.movie.id)}
                onMouseLeave={() => setHoveredMovieId(null)}
                onClick={() => openMovie(placement.movie)}
                style={{ cursor: "pointer", opacity: isDimmed ? 0.12 : 1 }}
              >
                <title>
                  {placement.movie.title} ({getReleaseYear(placement.movie)})
                </title>
                <rect
                  x={-7}
                  y={-10}
                  width={14}
                  height={20}
                  rx={2}
                  fill={genre.colour}
                  stroke="#f4f7ff"
                  strokeWidth={1}
                />
              </g>
            );
          })}

          {activePlacement && (
            <g key={activePlacement.movie.id} aria-live="polite">
              {activePlacement.matchingGenreIds.slice(1).map((genreId) => {
                const secondaryGenre = genreById.get(genreId);
                if (!secondaryGenre) return null;

                return (
                  <line
                    key={genreId}
                    x1={activePlacement.targetX}
                    y1={activePlacement.targetY}
                    x2={secondaryGenre.x + secondaryGenre.width / 2}
                    y2={secondaryGenre.y + secondaryGenre.height / 2}
                    stroke={secondaryGenre.colour}
                    strokeWidth={2}
                    strokeDasharray="6 7"
                    strokeOpacity={0.72}
                  />
                );
              })}

              <g filter="url(#card-shadow)">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={`${sourceXForYear(getReleaseYear(activePlacement.movie))} ${TIMELINE_Y}`}
                  to={`${activePlacement.targetX} ${activePlacement.targetY}`}
                  dur={`${Math.min(1100, intervalDuration * 0.82)}ms`}
                  fill="freeze"
                />

                <rect
                  x={-24}
                  y={-35}
                  width={48}
                  height={70}
                  rx={6}
                  fill="#172238"
                  stroke="#f0b35a"
                  strokeWidth={3}
                />

                {activePlacement.movie.poster_path ? (
                  <image
                    href={`${imageBaseUrl}${activePlacement.movie.poster_path}`}
                    x={-21}
                    y={-32}
                    width={42}
                    height={58}
                    preserveAspectRatio="xMidYMid slice"
                  />
                ) : (
                  <text
                    x={0}
                    y={2}
                    textAnchor="middle"
                    fill="#aeb8ca"
                    fontSize={10}
                  >
                    FILM
                  </text>
                )}

                <text
                  x={0}
                  y={48}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={10}
                  fontWeight={700}
                >
                  {activePlacement.movie.title.length > 18
                    ? `${activePlacement.movie.title.slice(0, 17)}…`
                    : activePlacement.movie.title}
                </text>
              </g>
            </g>
          )}
        </Box>
      </Box>

      <Typography sx={{ color: "#8490a5", mt: 2, fontSize: "0.82rem" }}>
        Each film settles in its first prominent TMDB genre. Additional genre
        memberships illuminate simultaneously, preserving the film’s hybrid
        classification. Select a genre or settled film to continue exploring.
      </Typography>
    </Box>
  );
};

export default GenreDealer;
