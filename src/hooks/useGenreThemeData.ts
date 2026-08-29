import { useQuery } from "react-query";

import { getMovieKeywords } from "../api/tmdb-api";

import {
  AtlasKeywordsResponse,
  CountryGenreDataset,
  GenreThemeDataset,
  ThemeFrequency,
} from "../types/cinemaAtlas";

export const useGenreThemeData = (
  countryData:
    | CountryGenreDataset
    | undefined,
  genreName: string
) => {
  return useQuery<GenreThemeDataset, Error>(
    [
      "cinema-atlas",
      "genre-themes",
      countryData?.countryCode,
      genreName,
    ],
    async () => {
      if (!countryData) {
        throw new Error(
          "Country dataset is unavailable."
        );
      }

      const selectedGenre =
        countryData.genreTrends.find(
          (trend) =>
            trend.genreName === genreName
        );

      if (!selectedGenre) {
        throw new Error(
          `Genre ${genreName} was not found.`
        );
      }

      const genreMovies =
        countryData.movies
          .filter((movie) =>
            movie.genre_ids.includes(
              selectedGenre.genreId
            )
          )
          .sort(
            (first, second) =>
              second.popularity -
              first.popularity
          )
          .slice(0, 24);

      const keywordResponses =
        await Promise.all(
          genreMovies.map((movie) =>
            getMovieKeywords(movie.id)
          )
        );

      const themeMap = new Map<
        number,
        ThemeFrequency
      >();

      keywordResponses.forEach(
        (response, index) => {
          const typedResponse =
            response as AtlasKeywordsResponse;

          typedResponse.keywords.forEach(
            (keyword) => {
              const existingTheme =
                themeMap.get(keyword.id);

              if (existingTheme) {
                existingTheme.count += 1;
                existingTheme.movieIds.push(
                  genreMovies[index].id
                );
              } else {
                themeMap.set(keyword.id, {
                  keywordId: keyword.id,
                  name: keyword.name,
                  count: 1,
                  movieIds: [
                    genreMovies[index].id,
                  ],
                });
              }
            }
          );
        }
      );

      const themes = [
        ...themeMap.values(),
      ]
        .sort(
          (first, second) =>
            second.count - first.count
        )
        .slice(0, 18);

      return {
        countryCode:
          countryData.countryCode,
        countryName:
          countryData.countryName,
        genreName,
        movies: genreMovies,
        themes,
      };
    },
    {
      enabled: Boolean(
        countryData && genreName
      ),
      staleTime: 360000,
    }
  );
};