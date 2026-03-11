"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Loader2 } from "lucide-react";
import Button from "@mui/material/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useInviteInfoQuery, useAcceptInviteMutation } from "@/queries/hooks";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const token = searchParams.get("token");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: inviteInfo, isLoading: infoLoading, isError: infoError } = useInviteInfoQuery(token, !!token);
  const acceptMutation = useAcceptInviteMutation();

  const handleAccept = async () => {
    if (!token || !isAuthenticated) return;
    try {
      const result = await acceptMutation.mutateAsync(token);
      toast.success(`"${result.communityName}" 커뮤니티에 가입했습니다.`);
      router.push(`/${result.communitySlug}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "가입에 실패했습니다.");
    }
  };

  if (!token) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <Users className="h-14 w-14 text-muted-foreground/50" />
        <div>
          <h1 className="text-xl font-bold">초대 링크가 없습니다</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            커뮤니티에서 받은 초대 링크로 접속해주세요.
          </p>
        </div>
        <Button component={Link} href="/" variant="contained" sx={{ borderRadius: 2 }}>
          홈으로
        </Button>
      </div>
    );
  }

  if (infoLoading || authLoading) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">초대 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (infoError || !inviteInfo) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <Users className="h-14 w-14 text-muted-foreground/50" />
        <div>
          <h1 className="text-xl font-bold">유효하지 않은 초대입니다</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            링크가 만료되었거나 이미 사용되었을 수 있습니다.
          </p>
        </div>
        <Button component={Link} href="/" variant="contained" sx={{ borderRadius: 2 }}>
          홈으로
        </Button>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h1 className="text-lg font-bold">"{inviteInfo.communityName}"에 가입하기</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            로그인한 후 가입할 수 있습니다.
          </p>
        </div>
        <Button
          component={Link}
          href={`/login?redirect=${encodeURIComponent(`/join?token=${token}`)}`}
          variant="contained"
          fullWidth
          sx={{ borderRadius: 2, py: 1.5 }}
        >
          로그인하고 가입하기
        </Button>
        <Button component={Link} href="/" variant="outlined" sx={{ borderRadius: 2 }}>
          홈으로
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="w-full rounded-2xl border border-border bg-card p-6">
        <h1 className="text-lg font-bold">"{inviteInfo.communityName}"에 가입하기</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          가입 후 커뮤니티 게시글과 모임을 이용할 수 있습니다.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <Button
          variant="contained"
          fullWidth
          disabled={acceptMutation.isPending}
          onClick={handleAccept}
          sx={{
            borderRadius: 2,
            py: 1.5,
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)" },
          }}
        >
          {acceptMutation.isPending ? "가입 중..." : "가입하기"}
        </Button>
        <Button component={Link} href="/" variant="outlined" sx={{ borderRadius: 2 }}>
          나중에 하기
        </Button>
      </div>
    </div>
  );
}
