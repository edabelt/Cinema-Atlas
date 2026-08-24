import React from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { useNavigate } from "react-router-dom";

import PlaylistForm from "../../components/playlistForm";
import PlaylistCard from "../../components/playlistCard";
import Spinner from "../../components/spinner";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistCoverUrl,
  getPlaylists,
} from "../../api/playlists-api";
import {
  CreatePlaylistRequest,
  Playlist,
} from "../../types/interfaces";

const PlaylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: playlists,
    error,
    isLoading,
    isError,
  } = useQuery<Playlist[], Error>(
    "playlists",
    getPlaylists
  );

  const createMutation = useMutation<
    Playlist,
    Error,
    CreatePlaylistRequest
  >(createPlaylist, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        "playlists"
      );
    },
  });

  const deleteMutation = useMutation<
    void,
    Error,
    number
  >(deletePlaylist, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        "playlists"
      );
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  const handleCreate = async (
    playlist: CreatePlaylistRequest
  ) => {
    await createMutation.mutateAsync(
      playlist
    );
  };

  const handleDelete = async (
    playlistId: number
  ) => {
    const confirmed = window.confirm(
      "Delete this playlist and all its movies?"
    );

    if (confirmed) {
      await deleteMutation.mutateAsync(
        playlistId
      );
    }
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
          navigate("/dashboard")
        }
        sx={{ marginBottom: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
      >
        My Playlists
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ marginBottom: 4 }}
      >
        Create themed collections and organise
        your favourite movies.
      </Typography>

      {(isError ||
        createMutation.isError ||
        deleteMutation.isError) && (
        <Alert
          severity="error"
          sx={{ marginBottom: 3 }}
        >
          {error?.message ||
            createMutation.error?.message ||
            deleteMutation.error?.message}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ padding: 3 }}>
            <PlaylistForm
              onSubmit={handleCreate}
              loading={
                createMutation.isLoading
              }
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          {playlists?.length === 0 ? (
            <Paper
              sx={{
                padding: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">
                You have no playlists yet.
              </Typography>

              <Typography color="text.secondary">
                Create your first themed movie
                collection.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {playlists?.map(
                (playlist) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    key={playlist.id}
                    sx={{ display: "flex" }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <PlaylistCard
                        playlist={playlist}
                        coverUrl={
                          getPlaylistCoverUrl(
                            playlist.cover_path
                          )
                        }
                        onOpen={(playlistId) =>
                          navigate(
                            `/movies/playlists/${playlistId}`
                          )
                        }
                        onDelete={handleDelete}
                        deleting={
                          deleteMutation.isLoading &&
                          deleteMutation.variables ===
                            playlist.id
                        }
                      />
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaylistsPage;