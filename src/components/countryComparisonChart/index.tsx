import React, { useMemo } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

import { CountryGenreDataset } from "../../types/cinemaAtlas";

interface CountryComparisonChartProps {
  primaryData: CountryGenreDataset;
  comparisonData: CountryGenreDataset;
  onSelectGenre: (genre: string) => void;
}

interface ChartClickParameters {
  name?: string;
}

const CountryComparisonChart: React.FC<
  CountryComparisonChartProps
> = ({
  primaryData,
  comparisonData,
  onSelectGenre,
}) => {
  const comparison = useMemo(() => {
    const calculateGenreAverages = (
      dataset: CountryGenreDataset
    ) => {
      const genreValues = new Map<
        string,
        number[]
      >();

      dataset.genreTrends.forEach((trend) => {
        const values =
          genreValues.get(trend.genreName) ??
          [];

        values.push(trend.percentage);

        genreValues.set(
          trend.genreName,
          values
        );
      });

      return new Map(
        [...genreValues.entries()].map(
          ([genre, values]) => [
            genre,
            values.reduce(
              (total, value) =>
                total + value,
              0
            ) / values.length,
          ]
        )
      );
    };

    const primaryAverages =
      calculateGenreAverages(primaryData);

    const comparisonAverages =
      calculateGenreAverages(
        comparisonData
      );

    const allGenres = new Set([
      ...primaryAverages.keys(),
      ...comparisonAverages.keys(),
    ]);

    return [...allGenres]
      .map((genre) => ({
        genre,
        primary:
          primaryAverages.get(genre) ?? 0,
        comparison:
          comparisonAverages.get(genre) ??
          0,
      }))
      .sort(
        (first, second) =>
          second.primary +
          second.comparison -
          (first.primary +
            first.comparison)
      )
      .slice(0, 8)
      .reverse();
  }, [primaryData, comparisonData]);

  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: "transparent",

      aria: {
        enabled: true,
        description: `Comparison of average genre prevalence between ${primaryData.countryName} and ${comparisonData.countryName}.`,
      },

      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor:
          "rgba(9,13,22,0.96)",
        borderColor:
          "rgba(255,255,255,0.18)",
        textStyle: {
          color: "#f7f7f7",
        },
        valueFormatter: (value) =>
          `${Math.abs(
            Number(value)
          ).toFixed(1)}%`,
      },

      legend: {
        top: 0,
        textStyle: {
          color: "#c9d1df",
        },
      },

      grid: {
        top: 50,
        right: 35,
        bottom: 35,
        left: 35,
        containLabel: true,
      },

      xAxis: {
        type: "value",
        min: -100,
        max: 100,
        axisLabel: {
          color: "#aeb8ca",
          formatter: (value: number) =>
            `${Math.abs(value)}%`,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color:
              "rgba(255,255,255,0.25)",
          },
        },
        splitLine: {
          lineStyle: {
            color:
              "rgba(255,255,255,0.06)",
          },
        },
      },

      yAxis: {
        type: "category",
        data: comparison.map(
          (item) => item.genre
        ),
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: "#d7ddea",
          fontWeight: 600,
        },
      },

      series: [
        {
          name: primaryData.countryName,
          type: "bar",
          cursor: "pointer",
          data: comparison.map(
            (item) => -item.primary
          ),
          itemStyle: {
            color: "#f0b35a",
            borderRadius: [4, 0, 0, 4],
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              color: "#ffc66f",
            },
          },
          label: {
            show: true,
            position: "left",
            color: "#f7d39b",
            formatter: (
              parameters: unknown
            ) => {
              const chartParameters =
                parameters as {
                  value?: unknown;
                };

              return `${Math.abs(
                Number(
                  chartParameters.value ?? 0
                )
              ).toFixed(1)}%`;
            },
          },
        },
        {
          name:
            comparisonData.countryName,
          type: "bar",
          cursor: "pointer",
          data: comparison.map(
            (item) => item.comparison
          ),
          itemStyle: {
            color: "#78c6a3",
            borderRadius: [0, 4, 4, 0],
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              color: "#9bdbbd",
            },
          },
          label: {
            show: true,
            position: "right",
            color: "#a6e2c7",
            formatter: (
              parameters: unknown
            ) => {
              const chartParameters =
                parameters as {
                  value?: unknown;
                };

              return `${Math.abs(
                Number(
                  chartParameters.value ?? 0
                )
              ).toFixed(1)}%`;
            },
          },
        },
      ],
    }),
    [
      comparison,
      primaryData.countryName,
      comparisonData.countryName,
    ]
  );

  const chartEvents = {
    click: (
      parameters: ChartClickParameters
    ) => {
      if (parameters.name) {
        onSelectGenre(parameters.name);
      }
    },
  };

  return (
    <Box
      sx={{
        mt: 3,
        p: {
          xs: 2,
          md: 3,
        },
        border:
          "1px solid rgba(255,255,255,0.12)",
        borderRadius: 4,
        background:
          "rgba(10,14,24,0.82)",
      }}
    >
      <Typography
        component="p"
        sx={{
          color: "#78c6a3",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Comparative view
      </Typography>

      <Typography
        component="h2"
        variant="h5"
        sx={{
          mt: 0.5,
          fontWeight: 600,
        }}
      >
        Genre profiles:{" "}
        {primaryData.countryName} and{" "}
        {comparisonData.countryName}
      </Typography>

      <Typography
        sx={{
          color: "#aeb8ca",
          mt: 0.5,
          mb: 1,
          fontSize: "0.95rem",
        }}
      >
        Average yearly prevalence among the
        sampled films. Select a bar to continue
        into its thematic evidence. Genres may
        overlap, so percentages do not total
        100%.
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: {
            xs: 400,
            md: 430,
          },
        }}
      >
        <ReactECharts
          option={option}
          onEvents={chartEvents}
          style={{
            width: "100%",
            height: "100%",
          }}
          notMerge
        />
      </Box>
    </Box>
  );
};

export default CountryComparisonChart;