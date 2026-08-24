import React, { ChangeEvent } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface FilterActorsCardProps {
  onUserInput: (
    filterType: string,
    value: string
  ) => void;
  nameFilter: string;
}

const FilterActorsCard: React.FC<
  FilterActorsCardProps
> = ({ onUserInput, nameFilter }) => {
  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onUserInput("name", event.target.value);
  };

  return (
    <Card sx={{ width: 400, minHeight: "100vh" }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
        >
          Filter Actors
        </Typography>

        <TextField
          label="Actor name"
          value={nameFilter}
          onChange={handleNameChange}
          variant="outlined"
          fullWidth
        />
      </CardContent>
    </Card>
  );
};

export default FilterActorsCard;