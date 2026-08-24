import React, { MouseEvent, useContext } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { ActorsContext } from "../../../contexts/actorsContext";
import { Actor } from "../../../types/interfaces";

const RemoveActorFromFavouritesIcon: React.FC<Actor> = (actor) => {
  const context = useContext(ActorsContext);

  const onUserRequest = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    context.removeFromFavourites(actor);
  };

  return (
    <IconButton
      aria-label="remove actor from favourites"
      onClick={onUserRequest}
    >
      <DeleteIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default RemoveActorFromFavouritesIcon;