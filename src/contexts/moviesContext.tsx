import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BaseMovieProps,
  Review,
} from "../types/interfaces";
import { AuthContext } from "./authContext";
import {
  addFavouriteMovie,
  getFavouriteMovies,
  removeFavouriteMovie,
} from "../api/favourites-api";

interface MovieContextInterface {
  favourites: number[];
  favouriteMovies: BaseMovieProps[];
  favouritesLoading: boolean;
  mustWatch: number[];
  addToFavourites: (
    movie: BaseMovieProps
  ) => Promise<void>;
  removeFromFavourites: (
    movie: BaseMovieProps
  ) => Promise<void>;
  addReview: (
    movie: BaseMovieProps,
    review: Review
  ) => void;
  addToMustWatch: (
    movie: BaseMovieProps
  ) => void;
}

const initialContextState: MovieContextInterface = {
  favourites: [],
  favouriteMovies: [],
  favouritesLoading: false,
  mustWatch: [],
  addToFavourites: async () => {},
  removeFromFavourites: async () => {},
  addReview: () => {},
  addToMustWatch: () => {},
};

export const MoviesContext =
  React.createContext<MovieContextInterface>(
    initialContextState
  );

const MoviesContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [
    favouriteMovies,
    setFavouriteMovies,
  ] = useState<BaseMovieProps[]>([]);

  const [
    favouritesLoading,
    setFavouritesLoading,
  ] = useState(false);

  const [, setMyReviews] = useState<
    Record<number, Review>
  >({});

  const [mustWatch, setMustWatch] =
    useState<number[]>([]);

  const favourites = favouriteMovies.map(
    (movie) => movie.id
  );

  useEffect(() => {
    let active = true;

    const loadFavourites = async () => {
      if (!user) {
        setFavouriteMovies([]);
        setFavouritesLoading(false);
        return;
      }

      setFavouritesLoading(true);

      try {
        const movies =
          await getFavouriteMovies();

        if (active) {
          setFavouriteMovies(movies);
        }
      } finally {
        if (active) {
          setFavouritesLoading(false);
        }
      }
    };

    loadFavourites();

    return () => {
      active = false;
    };
  }, [user]);

  const addToFavourites = useCallback(
    async (movie: BaseMovieProps) => {
      await addFavouriteMovie(movie);

      setFavouriteMovies(
        (currentFavourites) => {
          const alreadyAdded =
            currentFavourites.some(
              (favourite) =>
                favourite.id === movie.id
            );

          if (alreadyAdded) {
            return currentFavourites;
          }

          return [
            ...currentFavourites,
            movie,
          ];
        }
      );
    },
    []
  );

  const removeFromFavourites = useCallback(
    async (movie: BaseMovieProps) => {
      await removeFavouriteMovie(movie.id);

      setFavouriteMovies(
        (currentFavourites) =>
          currentFavourites.filter(
            (favourite) =>
              favourite.id !== movie.id
          )
      );
    },
    []
  );

  const addReview = (
    movie: BaseMovieProps,
    review: Review
  ) => {
    setMyReviews((currentReviews) => ({
      ...currentReviews,
      [movie.id]: review,
    }));
  };

  const addToMustWatch = (
    movie: BaseMovieProps
  ) => {
    setMustWatch((currentMustWatch) => {
      if (
        currentMustWatch.includes(movie.id)
      ) {
        return currentMustWatch;
      }

      return [
        ...currentMustWatch,
        movie.id,
      ];
    });
  };

  return (
    <MoviesContext.Provider
      value={{
        favourites,
        favouriteMovies,
        favouritesLoading,
        mustWatch,
        addToFavourites,
        removeFromFavourites,
        addReview,
        addToMustWatch,
      }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export default MoviesContextProvider;