import { useQuery } from "react-query";

import {
  getGenres,
  getMoviesByCountryAndYear,
} from "../api/tmdb-api";

import { buildGenreTrends } from "../cinemaAtlasUtils";

import {
  AtlasGenresResponse,
  AtlasMoviesResponse,
  CountryGenreDataset,
} from "../types/cinemaAtlas";

export const ATLAS_YEARS = [
  2018,
  2019,
  2020,
  2021,
  2022,
  2023,
  2024,
  2025,
];

export const useCountryGenreData = (
  countryCode: string,
  countryName: string
) => {
  return useQuery<CountryGenreDataset, Error>(
    [
      "cinema-atlas",
      "genre-trends",
      countryCode,
    ],
    async () => {
      const [
        genreResponse,
        ...movieResponses
      ] = await Promise.all([
        getGenres(),
        ...ATLAS_YEARS.map((year) =>
          getMoviesByCountryAndYear(
            countryCode,
            year
          )
        ),
      ]);

      const genres = (
        genreResponse as AtlasGenresResponse
      ).genres;

      const movies = (
        movieResponses as AtlasMoviesResponse[]
      ).flatMap((response) =>
        response.results.map((movie) => ({
          ...movie,
        }))
      );

      return {
        countryCode,
        countryName,
        years: ATLAS_YEARS,
        movies,
        genreTrends: buildGenreTrends(
          movies,
          genres,
          ATLAS_YEARS
        ),
      };
    },
    {
      enabled: Boolean(countryCode),
      keepPreviousData: true,
    }
  );
};