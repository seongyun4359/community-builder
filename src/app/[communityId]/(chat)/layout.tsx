"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronLeft, Menu, Users } from "lucide-react";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import PageTransition from "@/components/layout/PageTransition";
import ChatRoomSheet from "@/components/chat/ChatRoomSheet";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import {
  useEventQuery,
  useMembersQuery,
  useCreateInviteMutation,
} from "@/queries/hooks";

export default function CommunityChatLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const community = useCommunity();
  const { user } = useAuth();
  const params = useParams();
  const eventId = (Array.isArray(params.eventId) ? params.eventId[0] : params.eventId) as string | undefined;

  const [sheetOpen, setSheetOpen] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const { data: event } = useEventQuery(community.slug, eventId ?? "", !!eventId);
  const membersQuery = useMembersQuery(community.slug);
  const createInvite = useCreateInviteMutation(community.slug);

  const myMemberRole = useMemo(() => {
    if (!user) return null;
    const list = membersQuery.data as { userId: string; role: string }[] | undefined;
    return list?.find((m) => m.userId === user.id)?.role ?? null;
  }, [membersQuery.data, user]);

  const canInvite = useMemo(() => {
    if (!user) return false;
    if (user.id === community.ownerId) return true;
    return myMemberRole === "admin" || myMemberRole === "super_admin";
  }, [community.ownerId, myMemberRole, user]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm hover:bg-muted"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground">채팅</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {event?.title ? event.title : community.name}
            </div>
          </div>
          {user && (
            <>
              <button
                type="button"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground shadow-sm hover:bg-muted"
                aria-label="메뉴"
                aria-haspopup="menu"
                aria-expanded={!!menuAnchor}
              >
                <Menu className="h-5 w-5" />
              </button>
              <Popover
                open={!!menuAnchor}
                anchorEl={menuAnchor}
                onClose={() => setMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "var(--border)",
                      boxShadow: "var(--shadow-lg, 0 10px 15px -3px rgb(0 0 0 / 0.1))",
                    },
                  },
                }}
              >
                <MenuList disablePadding sx={{ py: 0.5 }}>
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      setSheetOpen(true);
                    }}
                    sx={{
                      gap: 1.5,
                      py: 1.5,
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      color: "var(--foreground)",
                      "&:hover": { bgcolor: "var(--muted)" },
                    }}
                  >
                    <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                    멤버 · 초대
                  </MenuItem>
                </MenuList>
              </Popover>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <PageTransition>{children}</PageTransition>
      </main>

      {user && (
        <ChatRoomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          communityName={community.name}
          ownerId={community.ownerId}
          meId={user.id}
          members={membersQuery.data}
          isMembersLoading={membersQuery.isLoading}
          canInvite={canInvite}
          inviteUrl={inviteUrl}
          isCreatingInvite={createInvite.isPending}
          onCreateInvite={async () => {
            const res = await createInvite.mutateAsync({});
            setInviteUrl(res.inviteUrl);
          }}
        />
      )}
    </>
  );
}

