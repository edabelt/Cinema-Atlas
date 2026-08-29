import React, { useContext } from "react";
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import InsightsIcon from "@mui/icons-material/Insights";
import HubIcon from "@mui/icons-material/Hub";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Link,
  Navigate,
} from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";

const LandingPage: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const analyticalPath = [
    "World",
    "Country",
    "Genre",
    "Theme",
    "Film",
  ];

  const benefits = [
    "Discover and filter movies",
    "Explore popular actors",
    "Save favourite films and performers",
    "Create personalised movie playlists",
  ];

  return (
    <Box
      sx={{
        minHeight: {
          xs: "auto",
          lg: "calc(100vh - 64px)",
        },
        color: "#f7f7f7",
        background:
          "radial-gradient(circle at 12% 10%, rgba(46,73,122,0.78) 0%, rgba(16,21,34,0.96) 38%, #080a0f 100%)",
        py: {
          xs: 2,
          md: 3,
        },
        px: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          maxWidth: 1240,
          minHeight: {
            lg: "calc(100vh - 112px)",
          },
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          color: "#f7f7f7",
          border:
            "1px solid rgba(255,255,255,0.12)",
          borderRadius: {
            xs: 4,
            md: 5,
          },
          background:
            "rgba(9,13,22,0.76)",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 24px 70px rgba(0,0,0,0.34)",
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            width: 360,
            height: 360,
            right: -130,
            top: -170,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(240,179,90,0.2), transparent 68%)",
          }}
        />

        <Box
          sx={{
            flexGrow: 1,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1.08fr 0.92fr",
            },
            gap: {
              xs: 3,
              lg: 4,
            },
            alignItems: "center",
            p: {
              xs: 3,
              sm: 4,
              lg: 5,
            },
          }}
        >
          <Box>
            <Typography
              component="p"
              sx={{
                color: "#f0b35a",
                letterSpacing: "0.17em",
                textTransform: "uppercase",
                fontWeight: 600,
                fontSize: {
                  xs: "0.78rem",
                  md: "0.88rem",
                },
                mb: 1.5,
              }}
            >
              Cinema Atlas Visual Analytics
            </Typography>

            <Typography
              component="h1"
              sx={{
                maxWidth: 650,
                fontWeight: 750,
                fontSize: {
                  xs: "2.35rem",
                  sm: "3rem",
                  lg: "3.65rem",
                },
                lineHeight: 1.03,
                letterSpacing: "-0.045em",
              }}
            >
              Discover cinema through{" "}
              <Box
                component="span"
                sx={{
                  color: "#f0b35a",
                }}
              >
                patterns
              </Box>
              , places and themes.
            </Typography>

            <Typography
              sx={{
                maxWidth: 620,
                color: "#bcc5d5",
                mt: 2,
                fontSize: {
                  xs: "1rem",
                  lg: "1.08rem",
                },
                lineHeight: 1.6,
              }}
            >
              Cinema Atlas transforms live movie
              metadata into an interactive
              investigation of geographic
              patterns, genre evolution and
              thematic relationships.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0.75,
                mt: 2.5,
              }}
            >
              {analyticalPath.map(
                (stage, index) => (
                  <React.Fragment key={stage}>
                    <Chip
                      label={stage}
                      size="small"
                      sx={{
                        color:
                          index === 0
                            ? "#111722"
                            : "#e7ebf2",
                        backgroundColor:
                          index === 0
                            ? "#f0b35a"
                            : "rgba(255,255,255,0.06)",
                        border:
                          index === 0
                            ? "none"
                            : "1px solid rgba(255,255,255,0.12)",
                      }}
                    />

                    {index <
                      analyticalPath.length -
                        1 && (
                      <Typography
                        aria-hidden="true"
                        sx={{
                          color: "#768198",
                        }}
                      >
                        →
                      </Typography>
                    )}
                  </React.Fragment>
                )
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                mt: 3,
              }}
            >
              <Button
                component={Link}
                to="/cinema-atlas"
                variant="contained"
                size="large"
                endIcon={
                  <ArrowForwardIcon />
                }
                sx={{
                  px: 2.5,
                  py: 1.15,
                  color: "#111722",
                  backgroundColor: "#f0b35a",
                  fontWeight: 700,
                  boxShadow:
                    "0 10px 26px rgba(240,179,90,0.22)",
                  "&:hover": {
                    backgroundColor:
                      "#ffc66f",
                    transform:
                      "translateY(-2px)",
                    boxShadow:
                      "0 14px 32px rgba(240,179,90,0.28)",
                  },
                  transition:
                    "transform 180ms ease, box-shadow 180ms ease, background 180ms ease",
                }}
              >
                Explore Cinema Atlas
              </Button>

              <Button
                component={Link}
                to="/movies"
                variant="outlined"
                size="large"
                sx={{
                  px: 2.5,
                  py: 1.15,
                  color: "#f7f7f7",
                  borderColor:
                    "rgba(255,255,255,0.28)",
                  "&:hover": {
                    borderColor: "#78c6a3",
                    backgroundColor:
                      "rgba(120,198,163,0.07)",
                  },
                }}
              >
                Browse Movies
              </Button>
            </Box>

            <Typography
              sx={{
                color: "#8793a8",
                mt: 1.5,
                fontSize: "0.82rem",
              }}
            >
              Cinema Atlas is public and requires
              no account.
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              minHeight: {
                xs: 350,
                lg: 390,
              },
              display: "grid",
              placeItems: "center",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: {
                  xs: 320,
                  lg: 390,
                },
                height: {
                  xs: 320,
                  lg: 390,
                },
                borderRadius: "50%",
                border:
                  "1px solid rgba(91,141,239,0.22)",
                transform:
                  "rotate(-12deg)",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: {
                  xs: 270,
                  lg: 330,
                },
                height: {
                  xs: 270,
                  lg: 330,
                },
                borderRadius: "50%",
                border:
                  "1px solid rgba(120,198,163,0.2)",
                transform:
                  "rotate(18deg)",
              }}
            />

            <Box
              sx={{
                position: "relative",
                width: {
                  xs: 210,
                  sm: 245,
                  lg: 270,
                },
                height: {
                  xs: 210,
                  sm: 245,
                  lg: 270,
                },
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                border:
                  "1px solid rgba(255,255,255,0.14)",
                background:
                  "radial-gradient(circle at 35% 30%, #32466f 0%, #172239 42%, #0b101b 72%)",
                boxShadow:
                  "0 24px 60px rgba(0,0,0,0.48), inset 0 0 45px rgba(91,141,239,0.12)",
              }}
            >
              <PublicIcon
                sx={{
                  color: "#f0b35a",
                  fontSize: {
                    xs: 82,
                    lg: 104,
                  },
                  filter:
                    "drop-shadow(0 10px 22px rgba(240,179,90,0.25))",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: -18,
                  right: 10,
                  width: 62,
                  height: 62,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  color: "#111722",
                  backgroundColor:
                    "#78c6a3",
                  boxShadow:
                    "0 10px 26px rgba(0,0,0,0.36)",
                }}
              >
                <HubIcon />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  left: -18,
                  bottom: 28,
                  width: 60,
                  height: 60,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  color: "#ffffff",
                  backgroundColor:
                    "#5b8def",
                  boxShadow:
                    "0 10px 26px rgba(0,0,0,0.36)",
                }}
              >
                <InsightsIcon />
              </Box>
            </Box>

            <Box
              sx={{
                position: "absolute",
                right: {
                  xs: 0,
                  lg: 5,
                },
                bottom: {
                  xs: 0,
                  lg: 5,
                },
                width: {
                  xs: 205,
                  lg: 230,
                },
                p: 2,
                border:
                  "1px solid rgba(255,255,255,0.13)",
                borderRadius: 3,
                background:
                  "rgba(12,17,28,0.92)",
                backdropFilter: "blur(14px)",
                boxShadow:
                  "0 15px 38px rgba(0,0,0,0.36)",
              }}
            >
              <Typography
                sx={{
                  color: "#78c6a3",
                  fontSize: "0.7rem",
                  letterSpacing: "0.11em",
                  textTransform: "uppercase",
                }}
              >
                Interactive research path
              </Typography>

              <Typography
                sx={{
                  mt: 0.75,
                  fontWeight: 600,
                  fontSize: "0.93rem",
                }}
              >
                Compare countries, trace genre
                trends and inspect supporting film
                evidence.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.25fr 0.75fr",
            },
            gap: 2,
            alignItems: "center",
            px: {
              xs: 3,
              sm: 4,
              lg: 5,
            },
            py: {
              xs: 3,
              lg: 2.5,
            },
            borderTop:
              "1px solid rgba(255,255,255,0.1)",
            background:
              "rgba(255,255,255,0.025)",
          }}
        >
          <Box>
            <Typography
              component="h2"
              variant="h6"
              sx={{ fontWeight: 650 }}
            >
              Build your own movie space
            </Typography>

            <Typography
              sx={{
                color: "#aeb8ca",
                mt: 0.25,
                mb: 1.25,
                fontSize: "0.9rem",
              }}
            >
              Create a free account for personal
              collections and saved content.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                },
                gap: 0.5,
              }}
            >
              {benefits.map((benefit) => (
                <Typography
                  key={benefit}
                  sx={{
                    color: "#c7cfdd",
                    fontSize: "0.86rem",
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      color: "#78c6a3",
                      mr: 0.75,
                    }}
                  >
                    ✓
                  </Box>

                  {benefit}
                </Typography>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: {
                md: "flex-end",
              },
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Button
              component={Link}
              to="/signup"
              variant="contained"
            >
              Create Account
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: "#f7f7f7",
                borderColor:
                  "rgba(255,255,255,0.3)",
              }}
            >
              Log In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LandingPage;