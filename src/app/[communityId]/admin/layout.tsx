"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LayoutDashboard, FileText, Bell, Shield, Settings, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import PageTransition from "@/components/layout/PageTransition";
import { PageLoading } from "@/components/ui/Loading";
import { motion } from "framer-motion";

const ADMIN_NAV = [
  { path: "", label: "대시보드", icon: LayoutDashboard },
  { path: "/posts", label: "게시글 관리", icon: FileText },
  { path: "/notices", label: "공지 관리", icon: Bell },
  { path: "/roles", label: "권한 관리", icon: Shield },
  { path: "/settings", label: "설정", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const community = useCommunity();
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/${community.slug}/admin`;

  const isOwner = user?.id === community.ownerId;

  if (isLoading) {
    return (
      <PageLoading />
    );
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
        <Lock className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">관리자 권한이 필요합니다</p>
        <button
          onClick={() => router.push(`/${community.slug}`)}
          className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          커뮤니티로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <Link
            href={`/${community.slug}`}
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-bold">{community.name}</span>
            <span className="text-[11px] text-muted-foreground">관리자</span>
          </div>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-56px)] flex-col pb-20 px-4 pt-4">
        <PageTransition>{children}</PageTransition>
      </main>

      <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-(--width-app) -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 items-center justify-around px-4">
          {ADMIN_NAV.map((item) => {
            const href = basePath + item.path;
            const isActive =
              item.path === ""
                ? pathname === basePath
                : pathname.startsWith(href);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-0.5 text-[11px] font-medium text-muted-foreground transition-colors",
                  isActive && "text-primary"
                )}
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  animate={{
                    scale: isActive ? 1.06 : 1,
                    opacity: isActive ? 1 : 0.9,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
