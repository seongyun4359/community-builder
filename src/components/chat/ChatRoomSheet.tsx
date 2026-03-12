"use client";

import { useMemo, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { Member } from "@/types";
import { cn } from "@/lib/utils";

type TabId = "members" | "invite";

const ROLE_LABEL: Record<string, string> = {
  super_admin: "최고관리자",
  admin: "관리자",
  moderator: "운영진",
  member: "멤버",
  guest: "게스트",
};

export default function ChatRoomSheet({
  open,
  onClose,
  communityName,
  ownerId,
  meId,
  members,
  isMembersLoading,
  canInvite,
  onCreateInvite,
  inviteUrl,
  isCreatingInvite,
}: {
  open: boolean;
  onClose: () => void;
  communityName: string;
  ownerId: string;
  meId: string;
  members: Member[] | undefined;
  isMembersLoading: boolean;
  canInvite: boolean;
  onCreateInvite: () => Promise<void>;
  inviteUrl: string | null;
  isCreatingInvite: boolean;
}) {
  const [tab, setTab] = useState<TabId>("members");
  const [copied, setCopied] = useState(false);

  const sortedMembers = useMemo(() => {
    const list = members ?? [];
    return [...list].sort((a, b) => {
      const aOwner = a.userId === ownerId ? 1 : 0;
      const bOwner = b.userId === ownerId ? 1 : 0;
      if (aOwner !== bOwner) return bOwner - aOwner;
      const aMe = a.userId === meId ? 1 : 0;
      const bMe = b.userId === meId ? 1 : 0;
      if (aMe !== bMe) return bMe - aMe;
      return 0;
    });
  }, [members, ownerId, meId]);

  if (!open) return null;

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // copy 실패는 무시 (toast는 상위에서 처리 가능)
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60">
        <motion.button
          type="button"
          onClick={onClose}
          className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
          aria-label="닫기"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        />

        <motion.div
          className="absolute bottom-0 left-1/2 w-full max-w-(--width-app) -translate-x-1/2 rounded-t-3xl border border-border bg-background shadow-2xl"
          initial={{ y: 28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 28, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.08}
          onDragEnd={(_e: PointerEvent, info: PanInfo) => {
            if (info.offset.y > 120 || info.velocity.y > 900) onClose();
          }}
        >
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground">채팅방 정보</div>
            <div className="truncate text-xs text-muted-foreground">{communityName}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            닫기
          </button>
        </div>

        <div className="px-4 pb-2">
          <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="px-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setTab("members")}
              className={cn(
                "rounded-xl py-2 text-xs font-semibold transition-colors",
                tab === "members" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              멤버
            </button>
            <button
              type="button"
              onClick={() => setTab("invite")}
              className={cn(
                "rounded-xl py-2 text-xs font-semibold transition-colors",
                tab === "invite" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              )}
            >
              초대
            </button>
          </div>
        </div>

        <div className="max-h-[70dvh] overflow-y-auto px-4 pb-6 pt-4">
          {tab === "members" ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">멤버</div>
                <div className="text-xs text-muted-foreground">{sortedMembers.length}명</div>
              </div>

              {isMembersLoading ? (
                <div className="text-sm text-muted-foreground">불러오는 중...</div>
              ) : sortedMembers.length === 0 ? (
                <div className="text-sm text-muted-foreground">멤버가 없습니다.</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {sortedMembers.map((m) => {
                    const isOwner = m.userId === ownerId;
                    const isMe = m.userId === meId;
                    const nickname = m.user?.nickname || m.user?.email || "알 수 없음";

                    return (
                      <div
                        key={m.id}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border border-border bg-card px-3 py-2",
                          isMe && "border-primary/40 bg-primary/5"
                        )}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            fontSize: "0.875rem",
                            bgcolor: "var(--primary)",
                            color: "var(--primary-foreground)",
                          }}
                        >
                          {nickname?.[0]?.toUpperCase() ?? "?"}
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-semibold text-foreground">
                              {nickname}
                            </span>
                            {isMe && (
                              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                나
                              </span>
                            )}
                            {isOwner && (
                              <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                방장
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {ROLE_LABEL[m.role] ?? m.role}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-sm font-semibold">초대 링크</div>
              <p className="text-xs text-muted-foreground">
                방장/관리자만 초대 링크를 만들 수 있어요.
              </p>

              {inviteUrl ? (
                <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3">
                  <div className="break-all text-xs text-foreground">{inviteUrl}</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCopy}
                      sx={{ borderRadius: 2, textTransform: "none", fontFamily: "inherit" }}
                    >
                      {copied ? "복사됨" : "복사"}
                    </Button>
                    <a
                      href={inviteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground no-underline hover:bg-muted"
                    >
                      열기
                    </a>
                    <Button
                      variant="text"
                      size="small"
                      disabled={isCreatingInvite}
                      onClick={() => onCreateInvite()}
                      sx={{ textTransform: "none", fontFamily: "inherit", fontSize: "0.75rem" }}
                    >
                      새로 만들기
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="contained"
                  disabled={!canInvite || isCreatingInvite}
                  onClick={() => onCreateInvite()}
                  sx={{
                    borderRadius: 3,
                    textTransform: "none",
                    fontFamily: "inherit",
                    fontWeight: 700,
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                    "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)" },
                    "&.Mui-disabled": { backgroundColor: "var(--muted)", color: "var(--muted-foreground)" },
                  }}
                >
                  {isCreatingInvite ? "생성 중..." : "초대 링크 생성"}
                </Button>
              )}
            </div>
          )}
        </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

