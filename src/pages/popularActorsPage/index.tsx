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

import Spinner from "../../components/spinner";
import ActorListPageTemplate from "../../components/templateActorListPage";
import AddActorToFavouritesIcon from "../../components/cardIcons/addActorToFavourites";
import ActorFilterUI, {
  actorNameFilter,
} from "../../components/actorFilterUI";

import { getPopularActors } from "../../api/tmdb-api";
import { AuthContext } from "../../contexts/authContext";
import useFiltering from "../../hooks/useFiltering";
import {
  Actor,
  DiscoverActors,
} from "../../types/interfaces";

const nameFiltering = {
  name: "name",
  value: "",
  condition: actorNameFilter,
};

const PopularActorsPage: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);

  const {
    data,
    error,
    isLoading,
    isError,
    isFetching,
  } = useQuery<DiscoverActors, Error>(
    ["popularActors", page],
    () => getPopularActors(page),
    {
      keepPreviousData: true,
    }
  );

  const {
    filterValues,
    setFilterValues,
    filterFunction,
  } = useFiltering([nameFiltering]);

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
    setFilterValues([
      {
        name: type,
        value,
      },
    ]);
  };

  const actors = data?.results ?? [];

  const displayedActors = user
    ? filterFunction(actors)
    : actors;

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
      <ActorListPageTemplate
        title="Popular Actors"
        actors={displayedActors}
        pagination={paginationControls}
        action={(actor: Actor) =>
          user ? (
            <AddActorToFavouritesIcon
              {...actor}
            />
          ) : null
        }
      />

      {user && (
        <ActorFilterUI
          onFilterValuesChange={
            changeFilterValues
          }
          nameFilter={filterValues[0].value}
        />
      )}
    </>
  );
};

export default PopularActorsPage;