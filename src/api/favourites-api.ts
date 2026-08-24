import { supabase } from "../supabaseClient";
import {
  Actor,
  BaseMovieProps,
} from "../types/interfaces";

interface FavouriteMovieRow {
  movie: BaseMovieProps;
}

interface FavouriteActorRow {
  actor: Actor;
}

export const getFavouriteMovies = async (): Promise<
  BaseMovieProps[]
> => {
  const { data, error } = await supabase
    .from("favourite_movies")
    .select("movie")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data as FavouriteMovieRow[]).map(
    (row) => row.movie
  );
};

export const addFavouriteMovie = async (
  movie: BaseMovieProps
): Promise<void> => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { error } = await supabase
    .from("favourite_movies")
    .upsert(
      {
        user_id: userData.user.id,
        movie_id: movie.id,
        movie,
      },
      {
        onConflict: "user_id,movie_id",
      }
    );

  if (error) {
    throw error;
  }
};

export const removeFavouriteMovie = async (
  movieId: number
): Promise<void> => {
  const { error } = await supabase
    .from("favourite_movies")
    .delete()
    .eq("movie_id", movieId);

  if (error) {
    throw error;
  }
};

export const getFavouriteActors = async (): Promise<
  Actor[]
> => {
  const { data, error } = await supabase
    .from("favourite_actors")
    .select("actor")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data as FavouriteActorRow[]).map(
    (row) => row.actor
  );
};

export const addFavouriteActor = async (
  actor: Actor
): Promise<void> => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) {
    throw userError;
  }

  if (!userData.user) {
    throw new Error("You must be logged in.");
  }

  const { error } = await supabase
    .from("favourite_actors")
    .upsert(
      {
        user_id: userData.user.id,
        actor_id: actor.id,
        actor,
      },
      {
        onConflict: "user_id,actor_id",
      }
    );

  if (error) {
    throw error;
  }
};

export const removeFavouriteActor = async (
  actorId: number
): Promise<void> => {
  const { error } = await supabase
    .from("favourite_actors")
    .delete()
    .eq("actor_id", actorId);

  if (error) {
    throw error;
  }
};