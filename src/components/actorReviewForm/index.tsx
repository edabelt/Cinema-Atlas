import React, { ChangeEvent, useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import { ActorsContext } from "../../contexts/actorsContext";
import { Actor, ActorReview } from "../../types/interfaces";
import styles from "../reviewForm/styles";
import ratings from "../reviewForm/ratingCategories";

const ActorReviewForm: React.FC<Actor> = (actor) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ActorReview>({
    defaultValues: {
      author: "",
      content: "",
      agree: false,
      rating: 3,
      actorId: actor.id,
    },
  });

  const navigate = useNavigate();
  const context = useContext(ActorsContext);

  const [rating, setRating] = useState(3);
  const [open, setOpen] = useState(false);

  const handleRatingChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setRating(Number(event.target.value));
  };

  const handleSnackClose = () => {
    setOpen(false);
    navigate("/actors/favourites");
  };

  const onSubmit: SubmitHandler<ActorReview> = (review) => {
    review.actorId = actor.id;
    review.rating = rating;

    context.addReview(actor, review);
    setOpen(true);
  };

  return (
    <Box component="div" sx={styles.root}>
      <Typography component="h2" variant="h3">
        Write a review for {actor.name}
      </Typography>

      <Snackbar
        sx={styles.snack}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleSnackClose}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={handleSnackClose}
        >
          <Typography variant="h4">
            Thank you for submitting a review
          </Typography>
        </Alert>
      </Snackbar>

      <form
        style={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Controller
          name="author"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              sx={{ width: "40ch" }}
              variant="outlined"
              margin="normal"
              required
              label="Author's name"
              autoFocus
            />
          )}
        />

        {errors.author && (
          <Typography variant="h6" component="p">
            {errors.author.message}
          </Typography>
        )}

        <Controller
          name="content"
          control={control}
          rules={{
            required: "Review cannot be empty.",
            minLength: {
              value: 10,
              message: "Review is too short",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Review text"
              multiline
              minRows={10}
            />
          )}
        />

        {errors.content && (
          <Typography variant="h6" component="p">
            {errors.content.message}
          </Typography>
        )}

        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              variant="outlined"
              label="Rating Select"
              value={rating}
              onChange={handleRatingChange}
              helperText="Don't forget your rating"
            >
              {ratings.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={styles.submit}
          >
            Submit
          </Button>

          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={styles.submit}
            onClick={() => {
              reset();
              setRating(3);
            }}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ActorReviewForm;