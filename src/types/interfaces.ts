import type { ReactNode } from "react";

export interface BaseMovieProps {
  title: string;
  budget: number;
  genre_ids: number[];
  homepage: string | undefined;
  id: number;
  imdb_id: string;
  original_language: string;
  overview: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  poster_path?: string;
  tagline: string;
  runtime: number;
  revenue: number;
  vote_count: number;
  favourite?: boolean;
}

export interface BaseMovieListProps {
  movies: BaseMovieProps[];
  action: (
    movie: BaseMovieProps
  ) => ReactNode;
}

export interface MovieDetailsProps
  extends BaseMovieProps {
  genres: {
    id: number;
    name: string;
  }[];

  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
}

export interface MovieImage {
  file_path: string;
  aspect_ratio?: number;
  height?: number;
  iso_639_1?: string;
  vote_average?: number;
  vote_count?: number;
  width?: number;
}

export interface MoviePageProps {
  movie: MovieDetailsProps;
  images: MovieImage[];
}

export type FilterOption =
  | "title"
  | "genre";

export interface MovieListPageTemplateProps
  extends BaseMovieListProps {
  title: string;
  pagination?: ReactNode;
}

export interface Review {
  id?: string;
  author: string;
  content: string;
  agree: boolean;
  rating: number;
  movieId: number;
}

export interface ActorReview {
  author: string;
  content: string;
  agree: boolean;
  rating: number;
  actorId: number;
}

export interface GenreData {
  genres: {
    id: string;
    name: string;
  }[];
}

export interface DiscoverMovies {
  page: number;
  total_pages: number;
  total_results: number;
  results: BaseMovieProps[];
}

export interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
}

export interface DiscoverActors {
  page: number;
  total_pages: number;
  total_results: number;
  results: Actor[];
}

export interface ActorDetailsProps
  extends Actor {
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  popularity: number;
  known_for_department: string;
}

export interface Playlist {
  id: number;
  user_id: string;
  title: string;
  theme: string;
  cover_path: string | null;
  created_at: string;
}

export interface PlaylistMovie {
  id: number;
  playlist_id: number;
  movie_id: number;
  title: string;
  poster_path: string | null;
  position: number;
  added_at: string;
}

export interface CreatePlaylist {
  title: string;
  theme: string;
}

export interface CreatePlaylistRequest
  extends CreatePlaylist {
  coverFile: File | null;
}