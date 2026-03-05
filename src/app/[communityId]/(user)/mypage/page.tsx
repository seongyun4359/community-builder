"use client";

import Image from "next/image";
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import { ChevronRight, FileText, MessageSquare, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";
import { useToast } from "@/hooks/useToast";

export default function MyPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const community = useCommunity();
  const toast = useToast();

  const isOwner = user?.id === community.ownerId;

  const handleLogout = () => {
    logout();
    toast.success("로그아웃되었습니다.");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-16">
        <p className="text-sm text-muted-foreground">로그인이 필요합니다</p>
        <Link
          href="/login"
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          로그인
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="flex items-center gap-4">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt="프로필"
            width={56}
            height={56}
            className="rounded-full object-cover"
            style={{ width: 56, height: 56 }}
          />
        ) : (
          <Avatar sx={{ width: 56, height: 56, fontSize: "1.25rem", bgcolor: "var(--primary)" }}>
            {user.nickname?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
          </Avatar>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-base font-bold">{user.nickname || "이름 없음"}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
          {isOwner && (
            <span className="mt-0.5 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              관리자
            </span>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-1">
        <h2 className="mb-1 text-xs font-semibold text-muted-foreground">활동</h2>
        <MenuRow icon={FileText} label="내가 쓴 게시글" href={`/${community.slug}/mypage`} />
        <MenuRow icon={MessageSquare} label="내가 쓴 댓글" href={`/${community.slug}/mypage`} />
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="mb-1 text-xs font-semibold text-muted-foreground">설정</h2>
        {isOwner && (
          <MenuRow icon={Settings} label="커뮤니티 관리" href={`/${community.slug}/admin`} />
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted"
        >
          <LogOut className="h-5 w-5 text-destructive" />
          <span className="flex-1 text-sm font-medium text-destructive">로그아웃</span>
        </button>
      </section>
    </div>
  );
}

function MenuRow({ icon: Icon, label, href }: { icon: React.ElementType; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}
