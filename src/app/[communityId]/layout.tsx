"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { fetchCommunityBySlug } from "@/services/community";
import type { Community } from "@/types";
import { CommunityContext } from "@/hooks/useCommunity";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const slug = params.communityId as string;
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCommunityBySlug(slug)
      .then((found) => {
        if (!found) {
          router.replace("/");
          return;
        }
        setCommunity(found);
      })
      .catch(() => router.replace("/"))
      .finally(() => setIsLoading(false));
  }, [slug, router]);

  if (isLoading || !community) {
    return (
      <AppShell>
        <div className="flex flex-1 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  return (
    <CommunityContext.Provider value={community}>
      <AppShell>
        {children}
      </AppShell>
    </CommunityContext.Provider>
  );
}
