import React from "react";
import Grid from "@mui/material/Grid";

import Header from "../headerMovieList";
import ActorList from "../actorList";
import { Actor } from "../../types/interfaces";

const styles = {
  root: {
    backgroundColor: "#bfbfbf",
  },
};

interface ActorListPageTemplateProps {
  actors: Actor[];
  title: string;
  action: (
    actor: Actor
  ) => React.ReactNode;
  pagination?: React.ReactNode;
}

const ActorListPageTemplate:
  React.FC<ActorListPageTemplateProps> = ({
    actors,
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
            <ActorList
              actors={actors}
              action={action}
            />
          </Grid>
        </Grid>

        {pagination}
      </>
    );
  };

export default ActorListPageTemplate;