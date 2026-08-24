import React, { type ChangeEvent } from "react";

import type { SelectChangeEvent } from "@mui/material";
import type {
  FilterOption,
  GenreData,
} from "../../types/interfaces";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SortIcon from "@mui/icons-material/Sort";

import { useQuery } from "react-query";
import { getGenres } from "../../api/tmdb-api";
import Spinner from "../spinner";

const styles = {
  root: {
    maxWidth: 345,
  },

  formControl: {
    margin: 1,
    minWidth: 220,
    backgroundColor: "rgb(255, 255, 255)",
  },
};

interface FilterMoviesCardProps {
  onUserInput: (filter: FilterOption, value: string) => void;
  titleFilter: string;
  genreFilter: string;
}

const FilterMoviesCard: React.FC<FilterMoviesCardProps> = ({
  titleFilter,
  genreFilter,
  onUserInput,
}) => {
  const {
    data,
    error,
    isLoading,
    isError,
  } = useQuery<GenreData, Error>("genres", getGenres);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <h1>{error?.message}</h1>;
  }

  const genres = [
    { id: 0, name: "All" },
    ...(data?.genres ?? []),
  ];

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<string>,
    type: FilterOption,
    value: string
  ) => {
    event.preventDefault();
    onUserInput(type, value);
  };

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    handleChange(event, "title", event.target.value);
  };

  const handleGenreChange = (
    event: SelectChangeEvent<string>
  ) => {
    handleChange(event, "genre", event.target.value);
  };

  return (
    <>
      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <FilterAltIcon fontSize="large" />
            Filter the movies
          </Typography>

          <TextField
            sx={styles.formControl}
            id="filled-search"
            label="Search field"
            type="search"
            value={titleFilter}
            variant="filled"
            onChange={handleTextChange}
          />

          <FormControl sx={styles.formControl}>
            <InputLabel id="genre-label">
              Genre
            </InputLabel>

            <Select
              labelId="genre-label"
              id="genre-select"
              label="Genre"
              value={genreFilter}
              onChange={handleGenreChange}
            >
              {genres.map((genre) => (
                <MenuItem
                  key={genre.id}
                  value={String(genre.id)}
                >
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      <Card sx={styles.root} variant="outlined">
        <CardContent>
          <Typography variant="h5" component="h1">
            <SortIcon fontSize="large" />
            Sort the movies
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default FilterMoviesCard;