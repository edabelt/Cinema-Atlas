import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import {
  CinemaCountry,
  cinemaCountries,
} from "../cinemaWorldMap";

interface CountryComparisonControlProps {
  primaryCountry: CinemaCountry;
  comparisonCountry: CinemaCountry | null;
  onSelectCountry: (
    country: CinemaCountry
  ) => void;
  onClearComparison: () => void;
}

const CountryComparisonControl: React.FC<
  CountryComparisonControlProps
> = ({
  primaryCountry,
  comparisonCountry,
  onSelectCountry,
  onClearComparison,
}) => {
  const availableCountries =
    cinemaCountries.filter(
      (country) =>
        country.tmdbCode !==
        primaryCountry.tmdbCode
    );

  return (
    <Box
      sx={{
        mt: 3,
        p: {
          xs: 2,
          md: 3,
        },
        display: "flex",
        alignItems: {
          xs: "stretch",
          md: "center",
        },
        justifyContent: "space-between",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 2,
        border:
          "1px solid rgba(255,255,255,0.12)",
        borderRadius: 4,
        background:
          "rgba(10,14,24,0.72)",
      }}
    >
      <Box>
        <Typography
          component="h2"
          variant="h6"
          sx={{ fontWeight: 600 }}
        >
          Compare national cinema patterns
        </Typography>

        <Typography
          sx={{
            color: "#aeb8ca",
            mt: 0.5,
            fontSize: "0.95rem",
          }}
        >
          Compare {primaryCountry.name} with a
          second film-producing country.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1.5,
          minWidth: {
            md: 390,
          },
        }}
      >
        <FormControl
          fullWidth
          size="small"
          sx={{
            minWidth: {
              sm: 250,
            },
          }}
        >
          <InputLabel
            id="comparison-country-label"
            sx={{
              color: "#aeb8ca",
              "&.Mui-focused": {
                color: "#78c6a3",
              },
            }}
          >
            Comparison country
          </InputLabel>

          <Select
            labelId="comparison-country-label"
            value={
              comparisonCountry?.tmdbCode ??
              ""
            }
            label="Comparison country"
            onChange={(event) => {
              const country =
                cinemaCountries.find(
                  (item) =>
                    item.tmdbCode ===
                    event.target.value
                );

              if (country) {
                onSelectCountry(country);
              }
            }}
            sx={{
              color: "#f7f7f7",
              "& .MuiOutlinedInput-notchedOutline":
                {
                  borderColor:
                    "rgba(255,255,255,0.24)",
                },
              "&:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#78c6a3",
                },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#78c6a3",
                },
              "& .MuiSvgIcon-root": {
                color: "#aeb8ca",
              },
            }}
          >
            {availableCountries.map(
              (country) => (
                <MenuItem
                  key={country.id}
                  value={country.tmdbCode}
                >
                  {country.name}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        {comparisonCountry && (
          <Button
            variant="outlined"
            onClick={onClearComparison}
            sx={{
              flexShrink: 0,
              color: "#f7f7f7",
              borderColor:
                "rgba(255,255,255,0.3)",
            }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CountryComparisonControl;