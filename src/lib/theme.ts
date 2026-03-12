"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Pretendard Variable",
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      "system-ui",
      "sans-serif",
    ].join(","),
    h1: { fontFamily: "GmarketSans, sans-serif" },
    h2: { fontFamily: "GmarketSans, sans-serif" },
    h3: { fontFamily: "GmarketSans, sans-serif" },
    h4: { fontFamily: "GmarketSans, sans-serif" },
    h5: { fontFamily: "GmarketSans, sans-serif" },
    h6: { fontFamily: "GmarketSans, sans-serif" },
  },
  palette: {
    primary: { main: "#00BEFF", contrastText: "#ffffff" },
    secondary: { main: "#ECE1FF", contrastText: "#191f28" },
    error: { main: "#f04452" },
    success: { main: "#00c471" },
    warning: { main: "#ff9f00" },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--primary)",
            borderWidth: "1.5px",
          },
        },
        notchedOutline: {
          borderColor: "var(--border)",
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
