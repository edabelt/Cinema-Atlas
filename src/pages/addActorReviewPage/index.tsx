import React from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "react-query";

import { getActor } from "../../api/tmdb-api";
import { ActorDetailsProps } from "../../types/interfaces";
import ActorReviewForm from "../../components/actorReviewForm";
import TemplateActorPage from "../../components/templateActorPage";
import Spinner from "../../components/spinner";

const AddActorReviewPage: React.FC = () => {
  const location = useLocation();
  const { actorId } = location.state as { actorId: number };

  const {
    data: actor,
    error,
    isLoading,
    isError,
  } = useQuery<ActorDetailsProps, Error>(
    ["actor", actorId],
    () => getActor(actorId.toString())
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return actor ? (
    <TemplateActorPage actor={actor}>
      <ActorReviewForm {...actor} />
    </TemplateActorPage>
  ) : (
    <p>Waiting for actor details...</p>
  );
};

export default AddActorReviewPage;