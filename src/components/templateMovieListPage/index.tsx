import React from "react";
import Grid from "@mui/material/Grid";

import Header from "../headerMovieList";
import MovieList from "../movieList";
import {
  MovieListPageTemplateProps,
} from "../../types/interfaces";

const styles = {
  root: {
    backgroundColor: "#bfbfbf",
  },
};

const MovieListPageTemplate:
  React.FC<MovieListPageTemplateProps> = ({
    movies,
    title,
    action,
    pagination,
  }) => {
    return (
      <>
        <Header title={title} />

        {pagination}

        <Grid container sx={styles.root}>
          <Grid item container spacing={5}>
            <MovieList
              movies={movies}
              action={action}
            />
          </Grid>
        </Grid>

        {pagination}
      </>
    );
  };

export default MovieListPageTemplate;