"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Shield, ChevronRight, UserMinus, Crown } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  useMembersQuery,
  useUpdateMemberRoleMutation,
  useExpelMemberMutation,
} from "@/queries/hooks";
import InviteBlock from "@/components/admin/InviteBlock";
import type { Member } from "@/types";
import type { UserRole } from "@/types";

const ROLE_CONFIG: { id: UserRole; label: string; description: string; color: string }[] = [
  { id: "super_admin", label: "최고 관리자", description: "모든 권한, 커뮤니티 삭제 가능", color: "bg-destructive/10 text-destructive" },
  { id: "admin", label: "관리자", description: "게시글/멤버 관리, 공지 작성", color: "bg-primary/10 text-primary" },
  { id: "moderator", label: "운영진", description: "게시글 관리, 신고 처리", color: "bg-warning/10 text-warning" },
  { id: "member", label: "일반 멤버", description: "게시글·댓글 작성", color: "bg-success/10 text-success" },
  { id: "guest", label: "게스트", description: "읽기 전용", color: "bg-muted text-muted-foreground" },
];

export default function AdminRolesPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();
  const { data: members = [] } = useMembersQuery(community.slug);
  const updateRole = useUpdateMemberRoleMutation(community.slug);
  const expelMember = useExpelMemberMutation(community.slug);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const isOwner = (m: Member) => m.userId === community.ownerId;
  const isMe = (m: Member) => m.userId === user?.id;
  const canChangeRole = (m: Member) => isOwner(m) ? false : true;
  const canExpel = (m: Member) => !isOwner(m) && !isMe(m);

  const roleCounts = useMemo(
    () =>
      ROLE_CONFIG.map((role) => ({
        ...role,
        count: members.filter((m) => m.role === role.id).length,
      })),
    [members]
  );

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      await updateRole.mutateAsync({ userId, role });
      toast.success("역할이 변경되었습니다.");
    } catch {
      toast.error("역할 변경에 실패했습니다.");
    }
  };

  const handleExpel = async (member: Member) => {
    if (!canExpel(member)) return;
    if (!confirm(`정말 "${member.user?.nickname || member.user?.email || "이 멤버"}"님을 추방하시겠습니까?`)) return;
    try {
      await expelMember.mutateAsync(member.userId);
      toast.success("멤버를 추방했습니다.");
    } catch {
      toast.error("추방에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">권한 관리</h1>
        <p className="text-sm text-muted-foreground">전체 멤버 {members.length}명</p>
      </div>

      <InviteBlock />

      <div className="flex flex-col gap-2">
        {roleCounts.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setExpandedRole((prev) => (prev === role.id ? null : role.id))}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${role.color}`}>
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{role.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {role.count}명
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{role.description}</span>
            </div>
            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform ${expandedRole === role.id ? "rotate-90" : ""}`}
            />
          </button>
        ))}
      </div>

      {ROLE_CONFIG.map((role) =>
        expandedRole === role.id ? (
          <div key={role.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3">
            <span className="px-1 text-xs font-medium text-muted-foreground">{role.label} 멤버</span>
            {members
              .filter((m) => m.role === role.id)
              .map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                >
                  {m.user?.profileImage ? (
                    <Image
                      src={m.user.profileImage}
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                      style={{ width: 36, height: 36 }}
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 36, height: 36, fontSize: "0.875rem", bgcolor: "var(--primary)" }}
                    >
                      {m.user?.nickname?.[0]?.toUpperCase() ?? "?"}
                    </Avatar>
                  )}
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">
                        {m.user?.nickname || m.user?.email || "알 수 없음"}
                      </span>
                      {isOwner(m) && <Crown className="h-3.5 w-3.5 text-warning" />}
                    </div>
                    <span className="text-xs text-muted-foreground">{m.user?.email}</span>
                  </div>
                  <Select
                    size="small"
                    value={m.role}
                    disabled={!canChangeRole(m)}
                    onChange={(e) => handleRoleChange(m.userId, e.target.value as UserRole)}
                    sx={{
                      minWidth: 110,
                      fontSize: "0.75rem",
                      "& .MuiSelect-select": { py: 0.75 },
                    }}
                  >
                    {ROLE_CONFIG.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {canExpel(m) && (
                    <button
                      type="button"
                      onClick={() => handleExpel(m)}
                      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                      aria-label="추방"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                      추방
                    </button>
                  )}
                </div>
              ))}
            {members.filter((m) => m.role === role.id).length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">해당 역할의 멤버가 없습니다.</p>
            )}
          </div>
        ) : null
      )}
    </div>
  );
}
