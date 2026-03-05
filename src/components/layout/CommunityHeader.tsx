"use client";

import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";

export default function CommunityHeader() {
  const community = useCommunity();
  const { user, isAuthenticated } = useAuth();

  const isOwner = user?.id === community.ownerId;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href={`/${community.slug}`} className="flex items-center gap-2">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {community.name[0]}
          </div>
          <span className="text-lg font-bold text-foreground">{community.name}</span>
        </Link>
        <nav className="flex items-center gap-2">
          {isAuthenticated && isOwner && (
            <Link
              href={`/${community.slug}/admin`}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-4 w-4" />
              관리
            </Link>
          )}
          {isAuthenticated && user ? (
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: "0.875rem",
                bgcolor: "var(--primary)",
              }}
            >
              {user.nickname?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </Avatar>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
