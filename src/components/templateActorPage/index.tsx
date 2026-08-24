import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ActorDetailsProps } from "../../types/interfaces";

const styles = {
  header: {
    padding: 2,
    textAlign: "center",
  },
  image: {
    width: "100%",
    maxWidth: 450,
    display: "block",
  },
};

interface TemplateActorPageProps {
  actor: ActorDetailsProps;
  children: React.ReactElement;
}

const TemplateActorPage: React.FC<TemplateActorPageProps> = ({
  actor,
  children,
}) => {
  const profileImage = actor.profile_path
    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
    : "https://via.placeholder.com/500x750?text=No+Actor+Image";

  return (
    <>
      <Paper sx={styles.header}>
        <Typography variant="h4" component="h1">
          {actor.name}
        </Typography>

        <Typography variant="subtitle1">
          {actor.known_for_department}
        </Typography>
      </Paper>

      <Grid container spacing={5} sx={{ padding: "15px" }}>
        <Grid item xs={12} md={3}>
          <img
            src={profileImage}
            alt={actor.name}
            style={styles.image}
          />
        </Grid>

        <Grid item xs={12} md={9}>
          {children}
        </Grid>
      </Grid>
    </>
  );
};

export default TemplateActorPage;