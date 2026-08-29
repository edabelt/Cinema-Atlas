import React from "react";
import { Box, Typography } from "@mui/material";
import {
  geoNaturalEarth1,
  geoPath,
} from "d3";
import { feature } from "topojson-client";
import type {
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import worldData from "world-atlas/countries-110m.json";

export interface CinemaCountry {
  id: string;
  name: string;
  tmdbCode: string;
}

interface CinemaWorldMapProps {
  selectedCountry: string;
  onSelectCountry: (
    country: CinemaCountry
  ) => void;
}

export const cinemaCountries: CinemaCountry[] = [
  {
    id: "840",
    name: "United States",
    tmdbCode: "US",
  },
  {
    id: "076",
    name: "Brazil",
    tmdbCode: "BR",
  },
  {
    id: "826",
    name: "United Kingdom",
    tmdbCode: "GB",
  },
  {
    id: "276",
    name: "Germany",
    tmdbCode: "DE",
  },
  {
    id: "752",
    name: "Sweden",
    tmdbCode: "SE",
  },
  {
    id: "710",
    name: "South Africa",
    tmdbCode: "ZA",
  },
  {
    id: "356",
    name: "India",
    tmdbCode: "IN",
  },
  {
    id: "410",
    name: "South Korea",
    tmdbCode: "KR",
  },
  {
    id: "036",
    name: "Australia",
    tmdbCode: "AU",
  },
];

const CinemaWorldMap: React.FC<
  CinemaWorldMapProps
> = ({
  selectedCountry,
  onSelectCountry,
}) => {
  const countries = feature(
    worldData as never,
    worldData.objects.countries as never
  ) as unknown as FeatureCollection<
    Geometry,
    GeoJsonProperties
  >;

  const projection = geoNaturalEarth1().fitSize(
    [960, 470],
    countries
  );

  const pathGenerator = geoPath(projection);

  const selectedCountryDetails =
    cinemaCountries.find(
      (country) =>
        country.tmdbCode === selectedCountry
    );

  const selectedFeature =
    countries.features.find(
      (country) =>
        String(country.id) ===
        selectedCountryDetails?.id
    );

  let mapTransform =
    "translate(0 0) scale(1)";

  if (selectedFeature) {
    const [[x0, y0], [x1, y1]] =
      pathGenerator.bounds(selectedFeature);

    const countryWidth = x1 - x0;
    const countryHeight = y1 - y0;

    const scale = Math.min(
      7,
      0.75 /
        Math.max(
          countryWidth / 960,
          countryHeight / 470
        )
    );

    const centreX = (x0 + x1) / 2;
    const centreY = (y0 + y1) / 2;

    mapTransform = `
      translate(480 235)
      scale(${scale})
      translate(${-centreX} ${-centreY})
    `;
  }

  return (
    <Box
      sx={{
        mt: 4,
        p: {
          xs: 2,
          md: 3,
        },
        border:
          "1px solid rgba(255,255,255,0.12)",
        borderRadius: 4,
        background:
          "rgba(10,14,24,0.72)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          component="h2"
          variant="h5"
          sx={{ mb: 0.5, fontWeight: 600 }}
        >
          Select a film-producing country
        </Typography>

        <Typography
          sx={{
            color: "#aeb8ca",
            fontSize: "0.95rem",
          }}
        >
          Move from the global view towards genres,
          themes and individual films.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1fr) 260px",
          },
          gap: {
            xs: 2,
            md: 3,
          },
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            height: {
              xs: 280,
              sm: 350,
              md: 390,
            },
            borderRadius: 3,
            overflow: "hidden",
            background:
              "rgba(4,7,13,0.32)",
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 960 470"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Interactive world map showing selected film-producing countries across six continents"
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              overflow: "hidden",
            }}
          >
            <title>
              Cinema Atlas country selection map
            </title>

            <g
              transform={mapTransform}
              style={{
                transition:
                  "transform 700ms ease",
              }}
            >
              {countries.features.map(
                (country) => {
                  const countryId = String(
                    country.id
                  );

                  const cinemaCountry =
                    cinemaCountries.find(
                      (item) =>
                        item.id === countryId
                    );

                  const isSelected =
                    cinemaCountry?.tmdbCode ===
                    selectedCountry;

                  return (
                    <path
                      key={countryId}
                      d={
                        pathGenerator(country) ??
                        ""
                      }
                      fill={
                        isSelected
                          ? "#f0b35a"
                          : cinemaCountry
                            ? "#4f78c8"
                            : "#252d3b"
                      }
                      stroke="#0c1018"
                      strokeWidth={0.7}
                      vectorEffect="non-scaling-stroke"
                      role={
                        cinemaCountry
                          ? "button"
                          : undefined
                      }
                      tabIndex={
                        cinemaCountry ? 0 : -1
                      }
                      aria-label={
                        cinemaCountry
                          ? `Explore films from ${cinemaCountry.name}`
                          : undefined
                      }
                      onClick={() => {
                        if (cinemaCountry) {
                          onSelectCountry(
                            cinemaCountry
                          );
                        }
                      }}
                      onKeyDown={(event) => {
                        if (
                          cinemaCountry &&
                          (event.key ===
                            "Enter" ||
                            event.key === " ")
                        ) {
                          event.preventDefault();

                          onSelectCountry(
                            cinemaCountry
                          );
                        }
                      }}
                      style={{
                        cursor: cinemaCountry
                          ? "pointer"
                          : "default",
                        transition:
                          "fill 220ms ease, opacity 220ms ease",
                        outline: "none",
                      }}
                    />
                  );
                }
              )}
            </g>
          </Box>
        </Box>

        <Box
          component="aside"
          aria-label="Available cinema countries"
          sx={{
            display: "flex",
            flexDirection: "column",
            p: 2,
            border:
              "1px solid rgba(255,255,255,0.08)",
            borderRadius: 3,
            background:
              "rgba(255,255,255,0.025)",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "#8793a8",
              letterSpacing: "0.13em",
              mb: 1.5,
            }}
          >
            Available countries
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(3, minmax(0, 1fr))",
                md: "1fr",
              },
              gap: 1,
            }}
          >
            {cinemaCountries.map(
              (country) => {
                const isSelected =
                  selectedCountry ===
                  country.tmdbCode;

                return (
                  <Box
                    component="button"
                    type="button"
                    key={country.id}
                    onClick={() =>
                      onSelectCountry(country)
                    }
                    aria-pressed={isSelected}
                    sx={{
                      width: "100%",
                      border: isSelected
                        ? "1px solid #f0b35a"
                        : "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 2,
                      px: 1.5,
                      py: 0.85,
                      color: isSelected
                        ? "#111722"
                        : "#e6eaf2",
                      background: isSelected
                        ? "#f0b35a"
                        : "rgba(255,255,255,0.035)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "0.86rem",
                      transition:
                        "background 180ms ease, border-color 180ms ease, transform 180ms ease",
                      "&:hover": {
                        borderColor:
                          "#f0b35a",
                        transform:
                          "translateX(2px)",
                      },
                      "&:focus-visible": {
                        outline:
                          "2px solid #78c6a3",
                        outlineOffset: 2,
                      },
                    }}
                  >
                    {country.name}
                  </Box>
                );
              }
            )}
          </Box>

          {selectedCountryDetails && (
            <Box
              sx={{
                mt: "auto",
                pt: 2,
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#8793a8" }}
              >
                Current selection
              </Typography>

              <Typography
                sx={{
                  color: "#f0b35a",
                  fontWeight: 600,
                }}
              >
                {selectedCountryDetails.name}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CinemaWorldMap;