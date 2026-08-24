import React, {
  FormEvent,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Spinner from "../../components/spinner";
import {
  addMovieToPlaylist,
  getPlaylist,
  getPlaylistCoverUrl,
  getPlaylistMovies,
  removeMovieFromPlaylist,
  reorderPlaylistMovies,
} from "../../api/playlists-api";
import {
  searchMovies,
} from "../../api/tmdb-api";
import placeholder from "../../images/film-poster-placeholder.png";
import {
  BaseMovieProps,
  DiscoverMovies,
  Playlist,
  PlaylistMovie,
} from "../../types/interfaces";

interface AddMovieRequest {
  playlistId: number;
  movie: BaseMovieProps;
}

const PlaylistDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const playlistId = Number(id);

  const [searchText, setSearchText] =
    useState("");

  const [
    submittedSearch,
    setSubmittedSearch,
  ] = useState("");

  const {
    data: playlist,
    error: playlistError,
    isLoading: playlistLoading,
    isError: playlistIsError,
  } = useQuery<Playlist, Error>(
    ["playlist", playlistId],
    () => getPlaylist(playlistId),
    {
      enabled: Number.isInteger(playlistId),
    }
  );

  const {
    data: movies,
    error: moviesError,
    isLoading: moviesLoading,
    isError: moviesIsError,
  } = useQuery<PlaylistMovie[], Error>(
    ["playlistMovies", playlistId],
    () => getPlaylistMovies(playlistId),
    {
      enabled: Number.isInteger(playlistId),
    }
  );

  const {
    data: searchResults,
    error: searchError,
    isLoading: searchLoading,
    isError: searchIsError,
  } = useQuery<DiscoverMovies, Error>(
    ["movieSearch", submittedSearch],
    () => searchMovies(submittedSearch),
    {
      enabled:
        submittedSearch.trim().length > 0,
    }
  );

  const addMutation = useMutation<
    PlaylistMovie,
    Error,
    AddMovieRequest
  >(
    ({ playlistId, movie }) =>
      addMovieToPlaylist(
        playlistId,
        movie
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "playlistMovies",
          playlistId,
        ]);
      },
    }
  );

  const removeMutation = useMutation<
    void,
    Error,
    number
  >(removeMovieFromPlaylist, {
    onSuccess: () => {
      queryClient.invalidateQueries([
        "playlistMovies",
        playlistId,
      ]);
    },
  });

  const reorderMutation = useMutation<
    void,
    Error,
    PlaylistMovie[]
  >(
    (orderedMovies) =>
      reorderPlaylistMovies(
        playlistId,
        orderedMovies
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          "playlistMovies",
          playlistId,
        ]);
      },
    }
  );

  if (playlistLoading || moviesLoading) {
    return <Spinner />;
  }

  if (
    !Number.isInteger(playlistId) ||
    playlistIsError ||
    moviesIsError ||
    !playlist
  ) {
    return (
      <Alert severity="error">
        {playlistError?.message ||
          moviesError?.message ||
          "Playlist not found."}
      </Alert>
    );
  }

  const coverUrl = getPlaylistCoverUrl(
    playlist.cover_path
  );

  const handleSearch = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setSubmittedSearch(
      searchText.trim()
    );
  };

  const handleAdd = async (
    movie: BaseMovieProps
  ) => {
    await addMutation.mutateAsync({
      playlistId,
      movie,
    });

    setSearchText("");
    setSubmittedSearch("");
  };

  const handleRemove = async (
    playlistMovieId: number
  ) => {
    await removeMutation.mutateAsync(
      playlistMovieId
    );
  };

  const handleMove = async (
    currentIndex: number,
    direction: -1 | 1
  ) => {
    if (!movies) {
      return;
    }

    const targetIndex =
      currentIndex + direction;

    if (
      targetIndex < 0 ||
      targetIndex >= movies.length
    ) {
      return;
    }

    const reorderedMovies = [...movies];

    [
      reorderedMovies[currentIndex],
      reorderedMovies[targetIndex],
    ] = [
      reorderedMovies[targetIndex],
      reorderedMovies[currentIndex],
    ];

    await reorderMutation.mutateAsync(
      reorderedMovies
    );
  };

  const isMovieAdded = (
    movieId: number
  ) => {
    return (
      movies?.some(
        (movie) =>
          movie.movie_id === movieId
      ) ?? false
    );
  };

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
      <Button
        onClick={() =>
          navigate("/movies/playlists")
        }
        sx={{ marginBottom: 3 }}
      >
        Back to Playlists
      </Button>

      <Paper
        sx={{
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        {coverUrl && (
          <Box
            component="img"
            src={coverUrl}
            alt={`${playlist.title} cover`}
            sx={{
              width: "100%",
              height: {
                xs: 220,
                md: 350,
              },
              objectFit: "cover",
            }}
          />
        )}

        <Box sx={{ padding: 3 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
          >
            {playlist.title}
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
          >
            {playlist.theme}
          </Typography>
        </Box>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          padding: 3,
          marginBottom: 4,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Search movies"
          value={searchText}
          onChange={(event) =>
            setSearchText(
              event.target.value
            )
          }
          required
          sx={{
            flexGrow: 1,
            minWidth: 220,
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!searchText.trim()}
        >
          Search
        </Button>
      </Paper>

      {(searchIsError ||
        addMutation.isError ||
        removeMutation.isError ||
        reorderMutation.isError) && (
        <Alert
          severity="error"
          sx={{ marginBottom: 3 }}
        >
          {searchError?.message ||
            addMutation.error?.message ||
            removeMutation.error?.message ||
            reorderMutation.error?.message}
        </Alert>
      )}

      {searchLoading && <Spinner />}

      {submittedSearch &&
        searchResults && (
          <Box sx={{ marginBottom: 5 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ marginBottom: 3 }}
            >
              Search Results
            </Typography>

            {searchResults.results.length ===
            0 ? (
              <Alert severity="info">
                No movies matched your search.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {searchResults.results.map(
                  (movie) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={3}
                      key={movie.id}
                      sx={{
                        display: "flex",
                      }}
                    >
                      <Card
                        sx={{
                          width: "100%",
                          display: "flex",
                          flexDirection:
                            "column",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="300"
                          image={
                            movie.poster_path
                              ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                              : placeholder
                          }
                          alt={movie.title}
                          sx={{
                            objectFit: "cover",
                          }}
                        />

                        <CardContent
                          sx={{
                            flexGrow: 1,
                          }}
                        >
                          <Typography variant="h6">
                            {movie.title}
                          </Typography>
                        </CardContent>

                        <CardActions>
                          <Button
                            disabled={
                              isMovieAdded(
                                movie.id
                              ) ||
                              addMutation.isLoading
                            }
                            onClick={() =>
                              handleAdd(movie)
                            }
                          >
                            {isMovieAdded(
                              movie.id
                            )
                              ? "Added"
                              : "Add"}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            )}
          </Box>
        )}

      <Typography
        variant="h4"
        component="h2"
        sx={{ marginBottom: 3 }}
      >
        Playlist Movies
      </Typography>

      {movies?.length === 0 ? (
        <Paper
          sx={{
            padding: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            This playlist has no movies yet.
          </Typography>

          <Typography color="text.secondary">
            Search for movies and add them to
            this collection.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {movies?.map(
            (movie, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={movie.id}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="360"
                    image={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        : placeholder
                    }
                    alt={movie.title}
                    sx={{
                      objectFit: "cover",
                    }}
                  />

                  <CardContent
                    sx={{ flexGrow: 1 }}
                  >
                    <Typography variant="h6">
                      {movie.title}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      aria-label="move movie up"
                      disabled={
                        index === 0 ||
                        reorderMutation.isLoading
                      }
                      onClick={() =>
                        handleMove(index, -1)
                      }
                    >
                      <ArrowUpwardIcon />
                    </Button>

                    <Button
                      aria-label="move movie down"
                      disabled={
                        index ===
                          movies.length - 1 ||
                        reorderMutation.isLoading
                      }
                      onClick={() =>
                        handleMove(index, 1)
                      }
                    >
                      <ArrowDownwardIcon />
                    </Button>

                    <Button
                      color="error"
                      disabled={
                        removeMutation.isLoading ||
                        reorderMutation.isLoading
                      }
                      onClick={() =>
                        handleRemove(movie.id)
                      }
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          )}
        </Grid>
      )}
    </Box>
  );
};

export default PlaylistDetailsPage;