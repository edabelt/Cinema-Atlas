import React, {
  MouseEvent,
  useContext,
  useState,
} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import {
  styled,
  useTheme,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../contexts/authContext";
import { supabase } from "../../supabaseClient";
import logo from "../../images/daddy-movies-logo.svg";

const Offset = styled("div")(
  ({ theme }) => theme.mixins.toolbar
);

type MenuType =
  | "mobile"
  | "movies"
  | "actors"
  | null;

const SiteHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const [menuType, setMenuType] =
    useState<MenuType>(null);

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("lg")
  );

  const open = Boolean(anchorEl);

  const displayName =
    user?.user_metadata.full_name ||
    user?.user_metadata.name ||
    user?.email?.split("@")[0];

  const guestOptions = [
    {
      label: "Movies",
      path: "/movies",
    },
    {
      label: "Upcoming",
      path: "/movies/upcoming",
    },
    {
      label: "Actors",
      path: "/actors",
    },
    {
      label: "Sign Up",
      path: "/signup",
    },
    {
      label: "Log In",
      path: "/login",
    },
  ];

  const movieOptions = [
    {
      label: "Discover Movies",
      path: "/movies",
    },
    {
      label: "Upcoming Movies",
      path: "/movies/upcoming",
    },
    {
      label: "Favourite Movies",
      path: "/movies/favourites",
    },
    {
      label: "My Playlists",
      path: "/movies/playlists",
    },
  ];

  const actorOptions = [
    {
      label: "Popular Actors",
      path: "/actors",
    },
    {
      label: "Favourite Actors",
      path: "/actors/favourites",
    },
  ];

  const closeMenu = () => {
    setAnchorEl(null);
    setMenuType(null);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    closeMenu();
  };

  const openMenu = (
    event: MouseEvent<HTMLButtonElement>,
    type: MenuType
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleLogoClick = () => {
    navigate(user ? "/dashboard" : "/");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    closeMenu();
    navigate("/");
  };

  const mobileOptions = user
    ? [
        {
          label: "Dashboard",
          path: "/dashboard",
        },
        ...movieOptions,
        ...actorOptions,
      ]
    : guestOptions;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="primary"
      >
        <Toolbar>
          <Box
            component="img"
            src={logo}
            alt="DaddyMovies"
            onClick={handleLogoClick}
            sx={{
              width: {
                xs: 170,
                sm: 220,
                md: 270,
              },
              height: 56,
              objectFit: "contain",
              objectPosition: "left center",
              cursor: "pointer",
              marginRight: "auto",
            }}
          />

          {user && (
            <Typography
              variant="body2"
              sx={{
                marginRight: 2,
                paddingX: 2,
                paddingY: 0.75,
                borderRadius: 5,
                backgroundColor:
                  "rgba(255, 255, 255, 0.16)",
                whiteSpace: "nowrap",
                display: {
                  xs: "none",
                  lg: "block",
                },
              }}
            >
              Hello, {displayName}
            </Typography>
          )}

          {isMobile ? (
            <>
              <IconButton
                aria-label="navigation menu"
                onClick={(event) =>
                  openMenu(event, "mobile")
                }
                color="inherit"
                size="large"
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={
                  open &&
                  menuType === "mobile"
                }
                onClose={closeMenu}
              >
                {user && (
                  <MenuItem disabled>
                    Hello, {displayName}
                  </MenuItem>
                )}

                {mobileOptions.map(
                  (option) => (
                    <MenuItem
                      key={option.label}
                      onClick={() =>
                        navigateTo(
                          option.path
                        )
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}

                {user && (
                  <MenuItem
                    onClick={handleLogout}
                  >
                    Log Out
                  </MenuItem>
                )}
              </Menu>
            </>
          ) : user ? (
            <>
              <Button
                color="inherit"
                onMouseEnter={closeMenu}
                onClick={() =>
                  navigateTo("/dashboard")
                }
              >
                Dashboard
              </Button>

              <Button
                color="inherit"
                onMouseEnter={(event) =>
                  openMenu(
                    event,
                    "movies"
                  )
                }
              >
                Movies
              </Button>

              <Button
                color="inherit"
                onMouseEnter={(event) =>
                  openMenu(
                    event,
                    "actors"
                  )
                }
              >
                Actors
              </Button>

              <Button
                color="inherit"
                onMouseEnter={closeMenu}
                onClick={handleLogout}
              >
                Log Out
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={
                  open &&
                  menuType === "movies"
                }
                onClose={closeMenu}
                MenuListProps={{
                  onMouseLeave:
                    closeMenu,
                }}
              >
                {movieOptions.map(
                  (option) => (
                    <MenuItem
                      key={option.label}
                      onClick={() =>
                        navigateTo(
                          option.path
                        )
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Menu>

              <Menu
                anchorEl={anchorEl}
                open={
                  open &&
                  menuType === "actors"
                }
                onClose={closeMenu}
                MenuListProps={{
                  onMouseLeave:
                    closeMenu,
                }}
              >
                {actorOptions.map(
                  (option) => (
                    <MenuItem
                      key={option.label}
                      onClick={() =>
                        navigateTo(
                          option.path
                        )
                      }
                    >
                      {option.label}
                    </MenuItem>
                  )
                )}
              </Menu>
            </>
          ) : (
            <>
              {guestOptions.map(
                (option) => (
                  <Button
                    key={option.label}
                    color="inherit"
                    onClick={() =>
                      navigateTo(
                        option.path
                      )
                    }
                  >
                    {option.label}
                  </Button>
                )
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      <Offset />
    </>
  );
};

export default SiteHeader;