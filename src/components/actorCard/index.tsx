import React, { useContext } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";

import img from "../../images/film-poster-placeholder.png";
import { Actor } from "../../types/interfaces";
import { ActorsContext } from "../../contexts/actorsContext";

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 500,
  },
  avatar: {
    backgroundColor: "rgb(255, 0, 0)",
  },
};

interface ActorCardProps {
  actor: Actor;
  action: (actor: Actor) => React.ReactNode;
}

const ActorCard: React.FC<ActorCardProps> = ({
  actor,
  action,
}) => {

  const { favourites } = useContext(ActorsContext);  

  const isFavourite = favourites.find((id) => id === actor.id)
    ? true
    : false;

  return (
    <Card sx={styles.card}>
      <CardHeader
        avatar={
          isFavourite ? (
            <Avatar sx={styles.avatar}>
              <FavoriteIcon />
            </Avatar>
          ) : null
        }
        title={
          <Typography variant="h5" component="p">
            {actor.name}
          </Typography>
        }
      />

      <CardMedia
        sx={styles.media}
        image={
          actor.profile_path
            ? `https://image.tmdb.org/t/p/w500/${actor.profile_path}`
            : img
        }
      />

      <CardActions disableSpacing>
        {action(actor)}

        <Link to={`/actors/${actor.id}`}>
          <Button variant="outlined" size="medium" color="primary">
            More Info ...
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default ActorCard;