"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, LayoutDashboard, FileText, Bell, Shield, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunity } from "@/hooks/useCommunity";

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
  const pathname = usePathname();
  const basePath = `/${community.slug}/admin`;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
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

      <div className="flex overflow-x-auto border-b border-border bg-background px-2">
        {ADMIN_NAV.map((item) => {
          const href = basePath + item.path;
          const isActive = item.path === ""
            ? pathname === basePath
            : pathname.startsWith(href);
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <main className="flex-1 px-4 py-6">
        {children}
      </main>
    </>
  );
}
