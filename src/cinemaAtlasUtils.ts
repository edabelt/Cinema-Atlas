import {
  AtlasGenre,
  AtlasMovie,
  GenreTrendPoint,
} from "./types/cinemaAtlas";

export const buildGenreTrends = (
  movies: AtlasMovie[],
  genres: AtlasGenre[],
  years: number[]
): GenreTrendPoint[] => {
  return years.flatMap((year) => {
    const moviesForYear = movies.filter(
      (movie) =>
        Number(
          movie.release_date?.slice(0, 4)
        ) === year
    );

    if (moviesForYear.length === 0) {
      return [];
    }

    return genres
      .map((genre) => {
        const count = moviesForYear.filter(
          (movie) =>
            movie.genre_ids.includes(genre.id)
        ).length;

        return {
          year,
          genreId: genre.id,
          genreName: genre.name,
          count,
          percentage: Number(
            (
              (count / moviesForYear.length) *
              100
            ).toFixed(1)
          ),
        };
      })
      .filter((trend) => trend.count > 0);
  });
};