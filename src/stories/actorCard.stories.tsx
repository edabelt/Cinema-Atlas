import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";

import ActorCard from "../components/actorCard";
import ActorsContextProvider from "../contexts/actorsContext";
import AddActorToFavouritesIcon from "../components/cardIcons/addActorToFavourites";
import { Actor } from "../types/interfaces";

const sampleActor: Actor = {
  id: 287,
  name: "Brad Pitt",
  profile_path: "/cckcYc2v0yh1tc9QjRelptcOBko.jpg",
};

const meta = {
  title: "Actors/ActorCard",
  component: ActorCard,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/"]}>
        <Story />
      </MemoryRouter>
    ),
    (Story) => (
      <ActorsContextProvider>
        <Story />
      </ActorsContextProvider>
    ),
  ],
} satisfies Meta<typeof ActorCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    actor: sampleActor,
    action: (actor) => (
      <AddActorToFavouritesIcon {...actor} />
    ),
  },
};

Basic.storyName = "Default";

const sampleActorWithoutImage: Actor = {
  ...sampleActor,
  profile_path: "",
};

export const Exceptional: Story = {
  args: {
    actor: sampleActorWithoutImage,
    action: (actor) => (
      <AddActorToFavouritesIcon {...actor} />
    ),
  },
};

Exceptional.storyName = "Without profile image";