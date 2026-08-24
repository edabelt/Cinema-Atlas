import React from "react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { Link } from "react-router-dom";
import { Actor } from "../../../types/interfaces";

const WriteActorReview: React.FC<Actor> = (actor) => {
  return (
    <Link
      to="/actors/reviews/form"
      state={{
        actorId: actor.id,
      }}
    >
      <RateReviewIcon color="primary" fontSize="large" />
    </Link>
  );
};

export default WriteActorReview;