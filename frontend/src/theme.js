// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#e10600",
      contrastText: "#fff",
    },
    secondary: {
      main: "#1b1b1b",
      contrastText: "#fff",
    },
    background: {
      default: "#f4f4f4",
      paper: "#fff",
    },
  },
  typography: {
    h4: { fontWeight: 700, letterSpacing: "0.05em" },
    h6: { fontWeight: 600 },
    button: { textTransform: "none" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: "none" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
  },
});

export default theme;
