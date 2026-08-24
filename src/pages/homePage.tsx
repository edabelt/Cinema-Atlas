import React, {
  useContext,
  useState,
} from "react";
import { useQuery } from "react-query";
import {
  Box,
  Pagination,
  Typography,
} from "@mui/material";

import PageTemplate from "../components/templateMovieListPage";
import { getMovies } from "../api/tmdb-api";
import useFiltering from "../hooks/useFiltering";
import MovieFilterUI, {
  titleFilter,
  genreFilter,
} from "../components/movieFilterUI";
import Spinner from "../components/spinner";
import AddToFavouritesIcon from "../components/cardIcons/addToFavourites";
import { AuthContext } from "../contexts/authContext";
import {
  DiscoverMovies,
  BaseMovieProps,
} from "../types/interfaces";

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

const HomePage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  const {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery<DiscoverMovies, Error>(
    ["discover", page],
    () => getMovies(page),
    {
      keepPreviousData: true,
    }
  );

  const {
    filterValues,
    setFilterValues,
    filterFunction,
  } = useFiltering([
    titleFiltering,
    genreFiltering,
  ]);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

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
        ? [changedFilter, filterValues[1]]
        : [filterValues[0], changedFilter];

    setFilterValues(updatedFilterSet);
  };

  const movies = data?.results ?? [];

  const displayedMovies = user
    ? filterFunction(movies)
    : movies;

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    selectedPage: number
  ) => {
    setPage(selectedPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const paginationControls = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        paddingY: 3,
      }}
    >
      {isFetching && (
        <Typography color="text.secondary">
          Loading page...
        </Typography>
      )}

      <Pagination
        page={page}
        count={Math.min(
          data?.total_pages ?? 1,
          500
        )}
        onChange={handlePageChange}
        color="primary"
        size="large"
        disabled={isFetching}
        showFirstButton
        showLastButton
      />
    </Box>
  );

  return (
    <>
      <PageTemplate
        title="Discover Movies"
        movies={displayedMovies}
        pagination={paginationControls}
        action={(movie: BaseMovieProps) =>
          user ? (
            <AddToFavouritesIcon {...movie} />
          ) : null
        }
      />

      {user && (
        <MovieFilterUI
          onFilterValuesChange={
            changeFilterValues
          }
          titleFilter={filterValues[0].value}
          genreFilter={
            filterValues[1].value
          }
        />
      )}
    </>
  );
};

export default HomePage;