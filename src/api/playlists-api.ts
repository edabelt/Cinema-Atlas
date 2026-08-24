import { supabase } from "../supabaseClient";
import {
  BaseMovieProps,
  CreatePlaylistRequest,
  Playlist,
  PlaylistMovie,
} from "../types/interfaces";

const coversBucket = "playlist-covers";

export const getPlaylists = async (): Promise<
  Playlist[]
> => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const getPlaylistCoverUrl = (
  coverPath: string | null
): string | null => {
  if (!coverPath) {
    return null;
  }

  const { data } = supabase.storage
    .from(coversBucket)
    .getPublicUrl(coverPath);

  return data.publicUrl;
};

export const createPlaylist = async (
  request: CreatePlaylistRequest
): Promise<Playlist> => {
  const {
    title,
    theme,
    coverFile,
  } = request;

  const { data: playlist, error: playlistError } =
    await supabase
      .from("playlists")
      .insert({
        title,
        theme,
      })
      .select()
      .single();

  if (playlistError) {
    throw playlistError;
  }

  if (!coverFile) {
    return playlist;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase
      .from("playlists")
      .delete()
      .eq("id", playlist.id);

    throw userError ??
      new Error("User session not found");
  }

  const extension =
    coverFile.name
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const filePath =
    `${user.id}/${playlist.id}-${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } =
    await supabase.storage
      .from(coversBucket)
      .upload(filePath, coverFile, {
        contentType: coverFile.type,
        upsert: false,
      });

  if (uploadError) {
    await supabase
      .from("playlists")
      .delete()
      .eq("id", playlist.id);

    throw uploadError;
  }

  const { data: updatedPlaylist, error: updateError } =
    await supabase
      .from("playlists")
      .update({
        cover_path: filePath,
      })
      .eq("id", playlist.id)
      .select()
      .single();

  if (updateError) {
    await supabase.storage
      .from(coversBucket)
      .remove([filePath]);

    await supabase
      .from("playlists")
      .delete()
      .eq("id", playlist.id);

    throw updateError;
  }

  return updatedPlaylist;
};

export const deletePlaylist = async (
  playlistId: number
): Promise<void> => {
  const { data: playlist, error: fetchError } =
    await supabase
      .from("playlists")
      .select("cover_path")
      .eq("id", playlistId)
      .single();

  if (fetchError) {
    throw fetchError;
  }

  if (playlist.cover_path) {
    const { error: storageError } =
      await supabase.storage
        .from(coversBucket)
        .remove([playlist.cover_path]);

    if (storageError) {
      throw storageError;
    }
  }

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId);

  if (error) {
    throw error;
  }
};

export const getPlaylistMovies = async (
  playlistId: number
): Promise<PlaylistMovie[]> => {
  const { data, error } = await supabase
    .from("playlist_movies")
    .select("*")
    .eq("playlist_id", playlistId)
    .order("position", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const addMovieToPlaylist = async (
  playlistId: number,
  movie: BaseMovieProps
): Promise<PlaylistMovie> => {
  const {
    data: lastMovie,
    error: positionError,
  } = await supabase
    .from("playlist_movies")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (positionError) {
    throw positionError;
  }

  const position =
    lastMovie === null
      ? 0
      : lastMovie.position + 1;

  const { data, error } = await supabase
    .from("playlist_movies")
    .insert({
      playlist_id: playlistId,
      movie_id: movie.id,
      title: movie.title,
      poster_path:
        movie.poster_path ?? null,
      position,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const removeMovieFromPlaylist = async (
  playlistMovieId: number
): Promise<void> => {
  const { error } = await supabase
    .from("playlist_movies")
    .delete()
    .eq("id", playlistMovieId);

  if (error) {
    throw error;
  }
};

export const getPlaylist = async (
  playlistId: number
): Promise<Playlist> => {
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const reorderPlaylistMovies = async (
  playlistId: number,
  movies: PlaylistMovie[]
): Promise<void> => {
  const updates = movies.map(
    (movie, position) =>
      supabase
        .from("playlist_movies")
        .update({ position })
        .eq("id", movie.id)
        .eq("playlist_id", playlistId)
  );

  const results = await Promise.all(updates);

  const failedUpdate = results.find(
    (result) => result.error
  );

  if (failedUpdate?.error) {
    throw failedUpdate.error;
  }
};