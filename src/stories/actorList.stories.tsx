import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import ActorList from "../components/actorList";
import ActorsContextProvider from "../contexts/actorsContext";
import AddActorToFavouritesIcon from "../components/cardIcons/addActorToFavourites";
import { Actor } from "../types/interfaces";

const sampleActors: Actor[] = [
  {
    id: 287,
    name: "Brad Pitt",
    profile_path: "/cckcYc2v0yh1tc9QjRelptcOBko.jpg",
  },
  {
    id: 1245,
    name: "Scarlett Johansson",
    profile_path: "/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg",
  },
  {
    id: 1892,
    name: "Matt Damon",
    profile_path: "/At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg",
  },
  {
    id: 9999,
    name: "Actor Without Image",
    profile_path: "",
  },
];

const meta = {
  title: "Actors/ActorList",
  component: ActorList,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <ActorsContextProvider>
          <GridWrapper>
            <Story />
          </GridWrapper>
        </ActorsContextProvider>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ActorList>;

export default meta;

type Story = StoryObj<typeof meta>;

const GridWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
      }}
    >
      {children}
    </div>
  );
};

export const Basic: Story = {
  args: {
    actors: sampleActors,
    action: (actor) => (
      <AddActorToFavouritesIcon {...actor} />
    ),
  },
};

Basic.storyName = "Default actor list";