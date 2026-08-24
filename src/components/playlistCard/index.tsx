import React from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";

import {
  Playlist,
} from "../../types/interfaces";

interface PlaylistCardProps {
  playlist: Playlist;
  coverUrl?: string | null;
  onOpen: (playlistId: number) => void;
  onDelete: (playlistId: number) => void;
  deleting?: boolean;
}

const PlaylistCard:
  React.FC<PlaylistCardProps> = ({
    playlist,
    coverUrl,
    onOpen,
    onDelete,
    deleting = false,
  }) => {
    return (
      <Card
        elevation={3}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {coverUrl ? (
          <CardMedia
            component="img"
            height="220"
            image={coverUrl}
            alt={`${playlist.title} cover`}
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #1565c0, #81d4fa)",
              color: "white",
            }}
          >
            <CollectionsIcon
              sx={{ fontSize: 80 }}
            />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
          >
            {playlist.title}
          </Typography>

          <Typography color="text.secondary">
            {playlist.theme}
          </Typography>
        </CardContent>

        <CardActions>
          <Button
            onClick={() =>
              onOpen(playlist.id)
            }
          >
            Open
          </Button>

          <Button
            color="error"
            disabled={deleting}
            onClick={() =>
              onDelete(playlist.id)
            }
          >
            {deleting
              ? "Deleting..."
              : "Delete"}
          </Button>
        </CardActions>
      </Card>
    );
  };

export default PlaylistCard;