import React, { useContext, type MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { MoviesContext } from "../../../contexts/moviesContext";
import { BaseMovieProps } from "../../../types/interfaces";

const AddToMustWatchIcon: React.FC<BaseMovieProps> = (movie) => {
  const { addToMustWatch } = useContext(MoviesContext);

  const handleAddToMustWatch = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    addToMustWatch(movie);
  };

  return (
    <IconButton
      aria-label="add to must watch"
      onClick={handleAddToMustWatch}
    >
      <PlaylistAddIcon color="primary" fontSize="large" />
    </IconButton>
  );
};

export default AddToMustWatchIcon;