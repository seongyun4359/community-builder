"use client";

import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";

interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "primary" | "secondary" | "ghost";
}

const variantMap: Record<NonNullable<ButtonProps["variant"]>, { mui: MuiButtonProps["variant"]; color: MuiButtonProps["color"] }> = {
  primary: { mui: "contained", color: "primary" },
  secondary: { mui: "outlined", color: "primary" },
  ghost: { mui: "text", color: "inherit" },
};

export default function Button({ variant = "primary", sx, ...props }: ButtonProps) {
  const { mui, color } = variantMap[variant];

  return (
    <MuiButton
      variant={mui}
      color={color}
      disableElevation
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.875rem",
        padding: "10px 24px",
        ...sx,
      }}
      {...props}
    />
  );
}
