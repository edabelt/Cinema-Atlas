import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Spinner from "../../components/spinner";
import TemplateActorPage from "../../components/templateActorPage";
import { getActor } from "../../api/tmdb-api";
import { ActorDetailsProps } from "../../types/interfaces";

const ActorDetailsPage: React.FC = () => {
  const { id } = useParams();

  const {
    data: actor,
    error,
    isLoading,
    isError,
  } = useQuery<ActorDetailsProps, Error>(
    ["actor", id],
    () => getActor(id!)
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return actor ? (
    <TemplateActorPage actor={actor}>
      <Box>
        <Typography variant="h4" component="h2" gutterBottom>
          Biography
        </Typography>

        <Typography variant="body1" paragraph>
          {actor.biography || "No biography available."}
        </Typography>

        <Typography variant="h6">
          Birthday: {actor.birthday || "Unknown"}
        </Typography>

        <Typography variant="h6">
          Place of birth: {actor.place_of_birth || "Unknown"}
        </Typography>

        <Typography variant="h6">
          Department: {actor.known_for_department || "Unknown"}
        </Typography>

        <Typography variant="h6">
          Popularity: {actor.popularity}
        </Typography>

        {actor.deathday && (
          <Typography variant="h6">
            Death date: {actor.deathday}
          </Typography>
        )}
      </Box>
    </TemplateActorPage>
  ) : (
    <p>Waiting for actor details...</p>
  );
};

export default ActorDetailsPage;