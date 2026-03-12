"use client";

import CommunityHeader from "@/components/layout/CommunityHeader";
import BottomNav from "@/components/layout/BottomNav";
import PageTransition from "@/components/layout/PageTransition";
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
      <main className="flex flex-1 flex-col pb-20">
        <PageTransition>{children}</PageTransition>
      </main>
      <BottomNav basePath={`/${community.slug}`} />
    </>
  );
}
