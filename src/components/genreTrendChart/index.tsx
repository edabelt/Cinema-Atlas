import React, { useMemo } from "react";
import {
  Box,
  Chip,
  Typography,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

import { CountryGenreDataset } from "../../types/cinemaAtlas";

interface GenreTrendChartProps {
  data: CountryGenreDataset;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

interface ChartClickParameters {
  seriesName?: string;
}

const chartColours = [
  "#f0b35a",
  "#5b8def",
  "#78c6a3",
  "#d17b88",
  "#9d8df1",
  "#58b8c9",
  "#d4cf68",
];

const GenreTrendChart: React.FC<
  GenreTrendChartProps
> = ({
  data,
  selectedGenre,
  onSelectGenre,
}) => {
  const topGenres = useMemo(() => {
    const totals = new Map<string, number>();

    data.genreTrends.forEach((trend) => {
      totals.set(
        trend.genreName,
        (totals.get(trend.genreName) ?? 0) +
          trend.count
      );
    });

    return [...totals.entries()]
      .sort(
        (first, second) =>
          second[1] - first[1]
      )
      .slice(0, 7)
      .map(([genreName]) => genreName);
  }, [data.genreTrends]);

  const option = useMemo<EChartsOption>(
    () => ({
      backgroundColor: "transparent",

      color: chartColours,

      animationDuration: 550,

      aria: {
        enabled: true,
        description: `Genre prevalence among sampled films from ${data.countryName} between 2018 and 2025.`,
      },

      tooltip: {
        trigger: "axis",
        backgroundColor:
          "rgba(9,13,22,0.96)",
        borderColor:
          "rgba(255,255,255,0.18)",
        textStyle: {
          color: "#f7f7f7",
        },
        valueFormatter: (value) =>
          `${value}% of sampled films`,
      },

      legend: {
        type: "scroll",
        top: 0,
        left: "center",
        right: 10,
        pageIconColor: "#f0b35a",
        pageIconInactiveColor: "#596276",
        pageTextStyle: {
          color: "#aeb8ca",
        },
        textStyle: {
          color: "#c9d1df",
          fontSize: 12,
        },
      },

      grid: {
        top: 60,
        right: 24,
        bottom: 48,
        left: 58,
        containLabel: true,
      },

      xAxis: {
        type: "category",
        name: "Release year",
        nameLocation: "middle",
        nameGap: 32,
        boundaryGap: false,
        data: data.years,
        axisLine: {
          lineStyle: {
            color: "#657087",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#aeb8ca",
        },
        nameTextStyle: {
          color: "#aeb8ca",
        },
      },

      yAxis: {
        type: "value",
        max: 100,
        axisLabel: {
          color: "#aeb8ca",
          formatter: "{value}%",
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color:
              "rgba(255,255,255,0.07)",
          },
        },
      },

      series: topGenres.map(
        (genreName) => {
          const isSelected =
            selectedGenre === genreName;

          return {
            name: genreName,
            type: "line",
            smooth: true,
            symbol: "circle",
            showSymbol: isSelected,
            symbolSize: isSelected ? 8 : 5,
            data: data.years.map((year) => {
              const trend =
                data.genreTrends.find(
                  (item) =>
                    item.year === year &&
                    item.genreName ===
                      genreName
                );

              return trend?.percentage ?? 0;
            }),
            lineStyle: {
              width: isSelected ? 4 : 2,
              opacity:
                selectedGenre &&
                !isSelected
                  ? 0.2
                  : 1,
            },
            itemStyle: {
              opacity:
                selectedGenre &&
                !isSelected
                  ? 0.2
                  : 1,
            },
            areaStyle: {
              opacity: isSelected
                ? 0.16
                : 0.025,
            },
            emphasis: {
              focus: "series",
              lineStyle: {
                width: 4,
              },
            },
          };
        }
      ),
    }),
    [
      data,
      selectedGenre,
      topGenres,
    ]
  );

  const chartEvents = {
    click: (
      parameters: ChartClickParameters
    ) => {
      if (parameters.seriesName) {
        onSelectGenre(
          parameters.seriesName
        );
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
          "rgba(10,14,24,0.78)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
          gap: 1.5,
          mb: 1,
        }}
      >
        <Box>
          <Typography
            component="h2"
            variant="h5"
            sx={{ fontWeight: 600 }}
          >
            Genre evolution in{" "}
            {data.countryName}
          </Typography>

          <Typography
            sx={{
              color: "#aeb8ca",
              mt: 0.5,
              fontSize: "0.95rem",
            }}
          >
            Select a line to reveal its
            thematic relationships.
          </Typography>
        </Box>

        {selectedGenre && (
          <Chip
            label={`Selected: ${selectedGenre}`}
            sx={{
              color: "#111722",
              backgroundColor: "#f0b35a",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          width: "100%",
          height: {
            xs: 340,
            sm: 370,
            md: 390,
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

export default GenreTrendChart;