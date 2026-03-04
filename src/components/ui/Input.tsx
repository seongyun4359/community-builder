"use client";

import TextField, { type TextFieldProps } from "@mui/material/TextField";

type InputProps = TextFieldProps;

export default function Input({ sx, ...props }: InputProps) {
  return (
    <TextField
      fullWidth
      size="medium"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          fontSize: "0.875rem",
        },
        ...sx,
      }}
      {...props}
    />
  );
}
