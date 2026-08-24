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

import MovieListPageTemplate from "../../components/templateMovieListPage";
import AddToMustWatchIcon from "../../components/cardIcons/addToMustWatch";
import Spinner from "../../components/spinner";
import { getUpcomingMovies } from "../../api/tmdb-api";
import { AuthContext } from "../../contexts/authContext";
import {
  BaseMovieProps,
  DiscoverMovies,
} from "../../types/interfaces";

const UpcomingMoviesPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  const {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery<DiscoverMovies, Error>(
    ["upcomingMovies", page],
    () => getUpcomingMovies(page),
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  const movies = data?.results ?? [];

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
    <MovieListPageTemplate
      title="Upcoming Movies"
      movies={movies}
      pagination={paginationControls}
      action={(movie: BaseMovieProps) =>
        user ? (
          <AddToMustWatchIcon {...movie} />
        ) : null
      }
    />
  );
};

export default UpcomingMoviesPage;