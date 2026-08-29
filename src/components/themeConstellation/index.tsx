import React, { useMemo } from "react";
import {
  Box,
  Chip,
  Typography,
} from "@mui/material";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3";

import {
  GenreThemeDataset,
  ThemeFrequency,
} from "../../types/cinemaAtlas";

interface ThemeConstellationProps {
  data: GenreThemeDataset;
  selectedTheme: string;
  onSelectTheme: (theme: string) => void;
}

interface ThemeNode
  extends SimulationNodeDatum {
  id: string;
  label: string;
  nodeType: "genre" | "theme";
  count: number;
  theme?: ThemeFrequency;
}

interface ThemeLink
  extends SimulationLinkDatum<ThemeNode> {
  source: string | ThemeNode;
  target: string | ThemeNode;
  weight: number;
  linkType:
    | "genre-theme"
    | "theme-theme";
}

const WIDTH = 960;
const HEIGHT = 420;

const ThemeConstellation: React.FC<
  ThemeConstellationProps
> = ({
  data,
  selectedTheme,
  onSelectTheme,
}) => {
  const graph = useMemo(() => {
    const genreNode: ThemeNode = {
      id: `genre-${data.genreName}`,
      label: data.genreName,
      nodeType: "genre",
      count: data.movies.length,
      x: WIDTH / 2,
      y: HEIGHT / 2,
      fx: WIDTH / 2,
      fy: HEIGHT / 2,
    };

    const themeNodes: ThemeNode[] =
      data.themes.map((theme) => ({
        id: `theme-${theme.keywordId}`,
        label: theme.name,
        nodeType: "theme",
        count: theme.count,
        theme,
      }));

    const nodes = [
      genreNode,
      ...themeNodes,
    ];

    const genreLinks: ThemeLink[] =
      themeNodes.map((node) => ({
        source: genreNode.id,
        target: node.id,
        weight: node.count,
        linkType: "genre-theme",
      }));

    const themeLinks: ThemeLink[] = [];

    for (
      let firstIndex = 0;
      firstIndex < themeNodes.length;
      firstIndex += 1
    ) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < themeNodes.length;
        secondIndex += 1
      ) {
        const firstTheme =
          themeNodes[firstIndex].theme;

        const secondTheme =
          themeNodes[secondIndex].theme;

        if (!firstTheme || !secondTheme) {
          continue;
        }

        const sharedMovies =
          firstTheme.movieIds.filter(
            (movieId) =>
              secondTheme.movieIds.includes(
                movieId
              )
          ).length;

        if (sharedMovies >= 2) {
          themeLinks.push({
            source:
              themeNodes[firstIndex].id,
            target:
              themeNodes[secondIndex].id,
            weight: sharedMovies,
            linkType: "theme-theme",
          });
        }
      }
    }

    const links = [
      ...genreLinks,
      ...themeLinks,
    ];

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<ThemeNode, ThemeLink>(
          links
        )
          .id((node) => node.id)
          .distance((link) =>
            link.linkType ===
            "genre-theme"
              ? 112
              : 68
          )
          .strength((link) =>
            link.linkType ===
            "genre-theme"
              ? 0.72
              : 0.18
          )
      )
      .force(
        "charge",
        forceManyBody().strength(-290)
      )
      .force(
        "centre",
        forceCenter(
          WIDTH / 2,
          HEIGHT / 2
        )
      )
      .force(
        "collision",
        forceCollide<ThemeNode>()
          .radius((node) =>
            node.nodeType === "genre"
              ? 58
              : 23 +
                Math.sqrt(node.count) *
                  3.5
          )
          .strength(0.9)
      )
      .stop();

    for (
      let iteration = 0;
      iteration < 260;
      iteration += 1
    ) {
      simulation.tick();
    }

    simulation.stop();

    return {
      nodes,
      links,
    };
  }, [data]);

  const getNodeRadius = (
    node: ThemeNode
  ) => {
    if (node.nodeType === "genre") {
      return 45;
    }

    return (
      9 + Math.sqrt(node.count) * 4
    );
  };

  const resolveNode = (
    node: string | ThemeNode
  ) => {
    if (typeof node !== "string") {
      return node;
    }

    return graph.nodes.find(
      (candidate) => candidate.id === node
    );
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
            Theme constellation for{" "}
            {data.genreName}
          </Typography>

          <Typography
            sx={{
              color: "#aeb8ca",
              mt: 0.5,
              fontSize: "0.95rem",
            }}
          >
            Node size indicates frequency.
            Connected themes occur together in
            at least two films.
          </Typography>
        </Box>

        {selectedTheme && (
          <Chip
            label={`Theme: ${selectedTheme}`}
            sx={{
              color: "#102019",
              backgroundColor: "#78c6a3",
              fontWeight: 600,
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          width: "100%",
          height: {
            xs: 380,
            sm: 400,
            md: 430,
          },
          borderRadius: 3,
          overflow: "hidden",
          background:
            "radial-gradient(circle at center, rgba(79,120,200,0.08), transparent 62%)",
        }}
      >
        <Box
          component="svg"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Interactive thematic network for ${data.genreName} films from ${data.countryName}`}
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <title>
            Theme constellation for{" "}
            {data.genreName} films from{" "}
            {data.countryName}
          </title>

          <g aria-hidden="true">
            {graph.links.map(
              (link, index) => {
                const source = resolveNode(
                  link.source
                );

                const target = resolveNode(
                  link.target
                );

                if (!source || !target) {
                  return null;
                }

                return (
                  <line
                    key={`${source.id}-${target.id}-${index}`}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke={
                      link.linkType ===
                      "genre-theme"
                        ? "#526d9f"
                        : "#5c6574"
                    }
                    strokeOpacity={
                      link.linkType ===
                      "genre-theme"
                        ? 0.45
                        : 0.18
                    }
                    strokeWidth={
                      link.linkType ===
                      "genre-theme"
                        ? Math.min(
                            7,
                            1 + link.weight
                          )
                        : Math.min(
                            3,
                            link.weight
                          )
                    }
                  />
                );
              }
            )}
          </g>

          {graph.nodes.map((node) => {
            const isGenre =
              node.nodeType === "genre";

            const isSelected =
              node.label === selectedTheme;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x ?? 0} ${node.y ?? 0})`}
                role={
                  isGenre
                    ? undefined
                    : "button"
                }
                tabIndex={
                  isGenre ? -1 : 0
                }
                aria-label={
                  isGenre
                    ? undefined
                    : `${node.label}, appearing in ${node.count} sampled films`
                }
                onClick={() => {
                  if (!isGenre) {
                    onSelectTheme(
                      node.label
                    );
                  }
                }}
                onKeyDown={(event) => {
                  if (
                    !isGenre &&
                    (event.key ===
                      "Enter" ||
                      event.key === " ")
                  ) {
                    event.preventDefault();

                    onSelectTheme(
                      node.label
                    );
                  }
                }}
                style={{
                  cursor: isGenre
                    ? "default"
                    : "pointer",
                  outline: "none",
                }}
              >
                {isSelected && (
                  <circle
                    r={
                      getNodeRadius(node) +
                      8
                    }
                    fill="none"
                    stroke="#78c6a3"
                    strokeWidth={2}
                    strokeOpacity={0.38}
                  />
                )}

                <circle
                  r={getNodeRadius(node)}
                  fill={
                    isGenre
                      ? "#f0b35a"
                      : isSelected
                        ? "#78c6a3"
                        : "#4f78c8"
                  }
                  stroke={
                    isSelected
                      ? "#e7fff3"
                      : "#101522"
                  }
                  strokeWidth={
                    isSelected ? 4 : 2
                  }
                  style={{
                    transition:
                      "fill 180ms ease, stroke 180ms ease",
                  }}
                />

                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    isGenre
                      ? "#111722"
                      : "#ffffff"
                  }
                  fontSize={
                    isGenre ? 15 : 10.5
                  }
                  fontWeight={600}
                  pointerEvents="none"
                >
                  {node.label}
                </text>

                {!isGenre && (
                  <text
                    y={
                      getNodeRadius(node) +
                      14
                    }
                    textAnchor="middle"
                    fill="#aeb8ca"
                    fontSize={9.5}
                    pointerEvents="none"
                  >
                    {node.count} films
                  </text>
                )}
              </g>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ThemeConstellation;