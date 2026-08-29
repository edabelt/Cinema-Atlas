export interface AtlasMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  original_language: string;
  origin_country?: string[];
}

export interface AtlasGenre {
  id: number;
  name: string;
}

export interface AtlasMoviesResponse {
  page: number;
  results: AtlasMovie[];
  total_pages: number;
  total_results: number;
}

export interface AtlasGenresResponse {
  genres: AtlasGenre[];
}

export interface AtlasKeyword {
  id: number;
  name: string;
}

export interface AtlasKeywordsResponse {
  id: number;
  keywords: AtlasKeyword[];
}

export interface GenreTrendPoint {
  year: number;
  genreId: number;
  genreName: string;
  count: number;
  percentage: number;
}

export interface CountryGenreDataset {
  countryCode: string;
  countryName: string;
  years: number[];
  movies: AtlasMovie[];
  genreTrends: GenreTrendPoint[];
}

export interface ThemeFrequency {
  keywordId: number;
  name: string;
  count: number;
  movieIds: number[];
}

export interface GenreThemeDataset {
  countryCode: string;
  countryName: string;
  genreName: string;
  movies: AtlasMovie[];
  themes: ThemeFrequency[];
}