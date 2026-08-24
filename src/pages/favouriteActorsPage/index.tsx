import React, {
  useContext,
} from "react";

import ActorListPageTemplate from "../../components/templateActorListPage";
import RemoveActorFromFavouritesIcon from "../../components/cardIcons/removeActorFromFavourites";
import WriteActorReview from "../../components/cardIcons/writeActorReview";
import Spinner from "../../components/spinner";
import { ActorsContext } from "../../contexts/actorsContext";
import { Actor } from "../../types/interfaces";

const FavouriteActorsPage: React.FC = () => {
  const {
    favouriteActors,
    favouritesLoading,
  } = useContext(ActorsContext);

  if (favouritesLoading) {
    return <Spinner />;
  }

  return (
    <ActorListPageTemplate
      title="Favourite Actors"
      actors={favouriteActors}
      action={(actor: Actor) => (
        <>
          <RemoveActorFromFavouritesIcon
            {...actor}
          />
          <WriteActorReview {...actor} />
        </>
      )}
    />
  );
};

export default FavouriteActorsPage;