import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Actor,
  ActorReview,
} from "../types/interfaces";
import { AuthContext } from "./authContext";
import {
  addFavouriteActor,
  getFavouriteActors,
  removeFavouriteActor,
} from "../api/favourites-api";

interface ActorsContextInterface {
  favourites: number[];
  favouriteActors: Actor[];
  favouritesLoading: boolean;
  addToFavourites: (
    actor: Actor
  ) => Promise<void>;
  removeFromFavourites: (
    actor: Actor
  ) => Promise<void>;
  addReview: (
    actor: Actor,
    review: ActorReview
  ) => void;
}

const initialContextState: ActorsContextInterface = {
  favourites: [],
  favouriteActors: [],
  favouritesLoading: false,
  addToFavourites: async () => {},
  removeFromFavourites: async () => {},
  addReview: () => {},
};

export const ActorsContext =
  React.createContext<ActorsContextInterface>(
    initialContextState
  );

const ActorsContextProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const { user } = useContext(AuthContext);

  const [
    favouriteActors,
    setFavouriteActors,
  ] = useState<Actor[]>([]);

  const [
    favouritesLoading,
    setFavouritesLoading,
  ] = useState(false);

  const [, setMyReviews] = useState<
    Record<number, ActorReview>
  >({});

  const favourites = favouriteActors.map(
    (actor) => actor.id
  );

  useEffect(() => {
    let active = true;

    const loadFavourites = async () => {
      if (!user) {
        setFavouriteActors([]);
        setFavouritesLoading(false);
        return;
      }

      setFavouritesLoading(true);

      try {
        const actors =
          await getFavouriteActors();

        if (active) {
          setFavouriteActors(actors);
        }
      } finally {
        if (active) {
          setFavouritesLoading(false);
        }
      }
    };

    loadFavourites();

    return () => {
      active = false;
    };
  }, [user]);

  const addToFavourites = useCallback(
    async (actor: Actor) => {
      await addFavouriteActor(actor);

      setFavouriteActors(
        (currentFavourites) => {
          const alreadyAdded =
            currentFavourites.some(
              (favourite) =>
                favourite.id === actor.id
            );

          if (alreadyAdded) {
            return currentFavourites;
          }

          return [
            ...currentFavourites,
            actor,
          ];
        }
      );
    },
    []
  );

  const removeFromFavourites = useCallback(
    async (actor: Actor) => {
      await removeFavouriteActor(actor.id);

      setFavouriteActors(
        (currentFavourites) =>
          currentFavourites.filter(
            (favourite) =>
              favourite.id !== actor.id
          )
      );
    },
    []
  );

  const addReview = (
    actor: Actor,
    review: ActorReview
  ) => {
    setMyReviews(
      (currentReviews) => ({
        ...currentReviews,
        [actor.id]: review,
      })
    );
  };

  return (
    <ActorsContext.Provider
      value={{
        favourites,
        favouriteActors,
        favouritesLoading,
        addToFavourites,
        removeFromFavourites,
        addReview,
      }}
    >
      {children}
    </ActorsContext.Provider>
  );
};

export default ActorsContextProvider;