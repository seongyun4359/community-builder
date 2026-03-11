"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { PageLoading } from "@/components/ui/Loading";
import { CommunityContext } from "@/hooks/useCommunity";
import { useCommunityQuery } from "@/queries/hooks";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.communityId as string;
  const { data: community, isLoading } = useCommunityQuery(slug);

  useEffect(() => {
    if (isLoading) return;
    if (!community) router.replace("/");
  }, [community, isLoading, router]);

  if (isLoading || !community) {
    return (
      <AppShell>
        <PageLoading />
      </AppShell>
    );
  }

  return (
    <div data-theme={community.theme}>
      <CommunityContext.Provider value={community}>
        <AppShell>
          {children}
        </AppShell>
      </CommunityContext.Provider>
    </div>
  );
}
