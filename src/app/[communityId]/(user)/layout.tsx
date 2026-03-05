"use client";

import CommunityHeader from "@/components/layout/CommunityHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useCommunity } from "@/hooks/useCommunity";

export default function CommunityUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const community = useCommunity();

  return (
    <>
      <CommunityHeader />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNav basePath={`/${community.slug}`} />
    </>
  );
}
