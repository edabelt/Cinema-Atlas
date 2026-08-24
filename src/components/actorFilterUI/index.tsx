import React, { useState } from "react";
import Fab from "@mui/material/Fab";
import Drawer from "@mui/material/Drawer";

import FilterActorsCard from "../filterActorsCard";
import { Actor } from "../../types/interfaces";

export const actorNameFilter = (
  actor: Actor,
  value: string
): boolean => {
  return actor.name
    .toLowerCase()
    .includes(value.toLowerCase());
};

const styles = {
  fab: {
    marginTop: 8,
    position: "fixed",
    top: 20,
    right: 2,
  },
};

interface ActorFilterUIProps {
  onFilterValuesChange: (
    filterType: string,
    value: string
  ) => void;
  nameFilter: string;
}

const ActorFilterUI: React.FC<
  ActorFilterUIProps
> = ({
  onFilterValuesChange,
  nameFilter,
}) => {
  const [drawerOpen, setDrawerOpen] =
    useState(false);

  return (
    <>
      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={styles.fab}
      >
        Filter Actors
      </Fab>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <FilterActorsCard
          onUserInput={onFilterValuesChange}
          nameFilter={nameFilter}
        />
      </Drawer>
    </>
  );
};

export default ActorFilterUI;