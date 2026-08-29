import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2b416c",
      light: "#506790",
      dark: "#131d31",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#d89a43",
      light: "#f0b35a",
      dark: "#a96d24",
      contrastText: "#111722",
    },

    background: {
      default: "#f3f4f8",
      paper: "#ffffff",
    },

    text: {
      primary: "#171d2e",
      secondary: "#616979",
    },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily:
      '"Roboto", "Helvetica", "Arial", sans-serif',

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(100deg, #131d31 0%, #1d2c4a 52%, #2b416c 100%)",
          borderBottom:
            "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 5px 18px rgba(12,18,31,0.18)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },

        containedPrimary: {
          boxShadow:
            "0 5px 14px rgba(43,65,108,0.22)",

          "&:hover": {
            backgroundColor: "#21365b",
            boxShadow:
              "0 7px 18px rgba(43,65,108,0.3)",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: "#2b416c",
        },
      },
    },

    MuiFab: {
      styleOverrides: {
        primary: {
          backgroundColor: "#2b416c",

          "&:hover": {
            backgroundColor: "#21365b",
          },
        },
      },
    },
  },
});

export default theme;