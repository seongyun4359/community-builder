"use client";

import { cn } from "@/lib/utils";

export function Spinner({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", className)}
      style={{ width: size, height: size }}
      aria-label="loading"
    />
  );
}

export function PageLoading({
  label = "로딩 중...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-4 py-20", className)}>
      <Spinner />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function Skeleton({ className }: { className: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

