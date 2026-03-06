"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import { LogOut, Settings, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export default function Header() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    toast.success("로그아웃되었습니다.");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="커뮤니티 빌더" width={28} height={28} />
          <span className="text-lg font-bold text-foreground">커뮤니티 빌더</span>
        </Link>
        <nav className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
          ) : isAuthenticated && user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-muted"
              >
                <span className="hidden text-sm text-muted-foreground sm:block">
                  {user.nickname || user.email}
                </span>
                {user.profileImage ? (
                  <Image src={user.profileImage} alt="" width={32} height={32}
                    className="rounded-full object-cover" style={{ width: 32, height: 32 }} />
                ) : (
                  <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem", bgcolor: "var(--primary)" }}>
                    {user.nickname?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
                  </Avatar>
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-medium">{user.nickname || "이름 없음"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link href="/create" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                      커뮤니티 만들기
                    </Link>
                    <Link href="/signup/profile" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-muted">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      프로필 설정
                    </Link>
                  </div>
                  <div className="border-t border-border py-1">
                    <button onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/5">
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                로그인
              </Link>
              <Link href="/signup"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
