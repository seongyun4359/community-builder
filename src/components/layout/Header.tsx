"use client";

import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-foreground">
          커뮤니티 빌더
        </Link>
        <nav className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
          ) : isAuthenticated && user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.nickname || user.email}
              </span>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem",
                  bgcolor: "var(--primary)",
                  cursor: "pointer",
                }}
                onClick={logout}
              >
                {user.nickname?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
              </Avatar>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                로그인
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
