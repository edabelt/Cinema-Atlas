export const getMovies = (page: number = 1) => {
  return fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&include_adult=false&include_video=false&page=${page}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Unable to fetch movies. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};

export const getMovie = (id: string) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Failed to get movie data. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};

export const getGenres = () => {
  return fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Unable to fetch genres. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};

export const getMovieImages = (
  id: string | number
) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/images?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }

      return response.json();
    })
    .then((json) => json.posters);
};

export const getMovieReviews = (
  id: string | number
) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Failed to fetch movie reviews"
        );
      }

      return response.json();
    })
    .then((json) => json.results);
};

export const getUpcomingMovies = (
  page: number = 1
) => {
  return fetch(
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&page=${page}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Failed to fetch upcoming movies. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};

export const getPopularActors = (
  page: number = 1
) => {
  return fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&page=${page}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Failed to fetch popular actors. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};

export const getActor = (id: string) => {
  return fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Failed to get actor data. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};

export const searchMovies = (
  query: string,
  page: number = 1
) => {
  return fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${
      import.meta.env.VITE_TMDB_KEY
    }&language=en-US&include_adult=false&query=${encodeURIComponent(
      query
    )}&page=${page}`
  ).then((response) => {
    if (!response.ok) {
      throw new Error(
        `Unable to search movies. Response status: ${response.status}`
      );
    }

    return response.json();
  });
};