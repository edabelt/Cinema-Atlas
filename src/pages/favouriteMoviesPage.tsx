import React, {
  useContext,
} from "react";
import PageTemplate from "../components/templateMovieListPage";
import { MoviesContext } from "../contexts/moviesContext";
import Spinner from "../components/spinner";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import RemoveFromFavourites from "../components/cardIcons/removeFromFavourites";
import WriteReview from "../components/cardIcons/writeReview";

const titleFiltering = {
  name: "title",
  value: "",
  condition: titleFilter,
};

const genreFiltering = {
  name: "genre",
  value: "0",
  condition: genreFilter,
};

const FavouriteMoviesPage: React.FC = () => {
  const {
    favouriteMovies,
    favouritesLoading,
  } = useContext(MoviesContext);

  const {
    filterValues,
    setFilterValues,
    filterFunction,
  } = useFiltering([
    titleFiltering,
    genreFiltering,
  ]);

  if (favouritesLoading) {
    return <Spinner />;
  }

  const displayedMovies = filterFunction(
    favouriteMovies
  );

  const changeFilterValues = (
    type: string,
    value: string
  ) => {
    const changedFilter = {
      name: type,
      value,
    };

    const updatedFilterSet =
      type === "title"
        ? [
            changedFilter,
            filterValues[1],
          ]
        : [
            filterValues[0],
            changedFilter,
          ];

    setFilterValues(updatedFilterSet);
  };

  return (
    <>
      <PageTemplate
        title="Favourite Movies"
        movies={displayedMovies}
        action={(movie) => (
          <>
            <RemoveFromFavourites
              {...movie}
            />
            <WriteReview {...movie} />
          </>
        )}
      />

      <MovieFilterUI
        onFilterValuesChange={
          changeFilterValues
        }
        titleFilter={
          filterValues[0].value
        }
        genreFilter={
          filterValues[1].value
        }
      />
    </>
  );
};

export default FavouriteMoviesPage;