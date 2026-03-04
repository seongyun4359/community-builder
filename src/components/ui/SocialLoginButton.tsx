"use client";

import MuiButton from "@mui/material/Button";
import type { SocialProvider } from "@/types";

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick: () => void;
  disabled?: boolean;
}

const providerConfig: Record<SocialProvider, { label: string; bgColor: string; textColor: string; hoverBgColor: string }> = {
  google: {
    label: "Google로 계속하기",
    bgColor: "#ffffff",
    textColor: "#3c4043",
    hoverBgColor: "#f8f9fa",
  },
  kakao: {
    label: "카카오로 계속하기",
    bgColor: "#FEE500",
    textColor: "#191919",
    hoverBgColor: "#e6cf00",
  },
};

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.67-.15.53-.96 3.41-1 3.58 0 0-.02.08.04.11.06.04.13.02.13.02.17-.02 3.03-1.98 3.52-2.32.53.08 1.08.12 1.65.12 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" fill="#191919" />
    </svg>
  );
}

export default function SocialLoginButton({ provider, onClick, disabled }: SocialLoginButtonProps) {
  const config = providerConfig[provider];
  const Icon = provider === "google" ? GoogleIcon : KakaoIcon;

  return (
    <MuiButton
      fullWidth
      onClick={onClick}
      disabled={disabled}
      startIcon={<Icon />}
      sx={{
        backgroundColor: config.bgColor,
        color: config.textColor,
        border: provider === "google" ? "1px solid #dadce0" : "none",
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.875rem",
        padding: "12px 24px",
        "&:hover": {
          backgroundColor: config.hoverBgColor,
        },
      }}
    >
      {config.label}
    </MuiButton>
  );
}
