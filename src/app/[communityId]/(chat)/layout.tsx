"use client";

import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import { useCommunity } from "@/hooks/useCommunity";
import { useEventQuery } from "@/queries/hooks";

export default function CommunityChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const community = useCommunity();
  const params = useParams();
  const eventId = (Array.isArray(params.eventId) ? params.eventId[0] : params.eventId) as string | undefined;

  const { data: event } = useEventQuery(community.slug, eventId ?? "", !!eventId);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm hover:bg-muted"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">채팅</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {event?.title ? event.title : community.name}
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}

