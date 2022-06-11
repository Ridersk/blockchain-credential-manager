import { createTheme } from "@mui/material";

const defaultTheme = createTheme();
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  components: {
    MuiFormControl: {
      defaultProps: {
        size: "small"
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#FFF",
            fontcolor: "#FFF"
          }
        }
      }
    },
    MuiOutlinedInput: {
      defaultProps: {
        size: "small"
      },
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFF"
          },
          borderStyle: "none"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#27293D"
        }
      }
    }
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#4E44CE"
    },
    secondary: {
      main: "#1D8CF8"
    },
    text: {
      primary: "#FFF",
      secondary: "#9A9A9A"
    },
    background: {
      default: "#1E1E2F"
    }
  },
  typography: {
    fontFamily: "Poppins",
    h6: {
      [defaultTheme.breakpoints.down("md")]: {
        fontSize: "1rem"
      },
      [defaultTheme.breakpoints.up("md")]: {
        fontSize: "1.2rem"
      }
    },
    subtitle2: {
      color: defaultTheme.palette.grey[500]
    }
  }
});
