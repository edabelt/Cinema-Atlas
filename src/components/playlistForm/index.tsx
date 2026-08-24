import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";

import {
  CreatePlaylistRequest,
} from "../../types/interfaces";

interface PlaylistFormProps {
  onSubmit: (
    playlist: CreatePlaylistRequest
  ) => Promise<void>;
  loading?: boolean;
}

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const maximumFileSize = 5 * 1024 * 1024;

const PlaylistForm:
  React.FC<PlaylistFormProps> = ({
    onSubmit,
    loading = false,
  }) => {
    const [title, setTitle] = useState("");
    const [theme, setTheme] = useState("");
    const [coverFile, setCoverFile] =
      useState<File | null>(null);
    const [previewUrl, setPreviewUrl] =
      useState<string | null>(null);
    const [fileError, setFileError] =
      useState("");

    const fileInputRef =
      useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    const handleCoverChange = (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      const file =
        event.target.files?.[0] ?? null;

      setFileError("");

      if (!file) {
        setCoverFile(null);
        setPreviewUrl(null);
        return;
      }

      if (!acceptedTypes.includes(file.type)) {
        setFileError(
          "Choose a JPEG, PNG or WebP image."
        );
        event.target.value = "";
        return;
      }

      if (file.size > maximumFileSize) {
        setFileError(
          "The cover image must be smaller than 5 MB."
        );
        event.target.value = "";
        return;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setCoverFile(file);
      setPreviewUrl(
        URL.createObjectURL(file)
      );
    };

    const handleSubmit = async (
      event: FormEvent
    ) => {
      event.preventDefault();

      await onSubmit({
        title: title.trim(),
        theme: theme.trim(),
        coverFile,
      });

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setTitle("");
      setTheme("");
      setCoverFile(null);
      setPreviewUrl(null);
      setFileError("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5">
          Create a playlist
        </Typography>

        <TextField
          label="Playlist title"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          required
          inputProps={{ maxLength: 80 }}
        />

        <TextField
          label="Theme"
          value={theme}
          onChange={(event) =>
            setTheme(event.target.value)
          }
          required
          inputProps={{ maxLength: 120 }}
          helperText="For example: Science fiction classics"
        />

        <Button
          component="label"
          variant="outlined"
        >
          Choose Cover Image

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={handleCoverChange}
          />
        </Button>

        {fileError && (
          <Alert severity="error">
            {fileError}
          </Alert>
        )}

        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt="Playlist cover preview"
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={
            loading ||
            Boolean(fileError) ||
            !title.trim() ||
            !theme.trim()
          }
        >
          {loading
            ? "Creating..."
            : "Create Playlist"}
        </Button>
      </Box>
    );
  };

export default PlaylistForm;