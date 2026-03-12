"use client";

import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Link2, Copy, QrCode, MessageCircle } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useToast } from "@/hooks/useToast";
import { useCreateInviteMutation } from "@/queries/hooks";

const KAKAO_JS_KEY = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? "") : "";

export default function InviteBlock() {
  const community = useCommunity();
  const toast = useToast();
  const createInvite = useCreateInviteMutation(community.slug);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [kakaoReady, setKakaoReady] = useState<boolean>(() => {
    if (typeof window === "undefined" || !KAKAO_JS_KEY) return false;
    const w = window as unknown as {
      Kakao?: { Share?: { sendDefault: (opts: unknown) => Promise<unknown> } };
    };
    return !!w.Kakao?.Share;
  });

  useEffect(() => {
    if (!KAKAO_JS_KEY || kakaoReady) return;
    const script = document.createElement("script");
    script.src = "https://t.kakao.com/v2/sdk/js/kakao.min.js";
    script.async = true;
    script.onload = () => {
      const Kakao = (window as unknown as { Kakao: { init: (key: string) => void; Share?: unknown } }).Kakao;
      if (Kakao && KAKAO_JS_KEY && !Kakao.Share) {
        Kakao.init(KAKAO_JS_KEY);
      }
      setKakaoReady(true);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [kakaoReady]);

  const handleCreateLink = async () => {
    try {
      const result = await createInvite.mutateAsync({});
      setInviteUrl(result.inviteUrl);
      toast.success("초대 링크가 생성되었습니다.");
    } catch {
      toast.error("초대 링크 생성에 실패했습니다.");
    }
  };

  const handleCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("링크가 복사되었습니다.");
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleKakaoShare = () => {
    if (!inviteUrl || !kakaoReady) {
      toast.error("카카오 공유를 사용하려면 앱 키를 설정해주세요.");
      return;
    }
    const Kakao = (window as unknown as {
      Kakao?: { Share: { sendDefault: (opts: unknown) => Promise<unknown> } };
    }).Kakao;
    if (!Kakao?.Share?.sendDefault) {
      toast.error("카카오 공유를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${community.name} 커뮤니티 초대`,
        description: "초대 링크를 눌러 가입하세요.",
        link: {
          mobileWebUrl: inviteUrl,
          webUrl: inviteUrl,
        },
      },
    }).catch(() => {
      toast.error("카카오톡 공유에 실패했습니다.");
    });
  };

  const showQr = inviteUrl != null;
  const qrSrc = showQr
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(inviteUrl)}`
    : "";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <h2 className="text-sm font-semibold">멤버 초대</h2>
      <p className="text-xs text-muted-foreground">
        초대 링크를 만들어 멤버를 초대하세요. 링크 복사, QR 코드, 카카오톡 공유를 사용할 수 있습니다.
      </p>

      {!inviteUrl ? (
        <Button
          variant="contained"
          size="small"
          startIcon={<Link2 className="h-4 w-4" />}
          disabled={createInvite.isPending}
          onClick={handleCreateLink}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: 600,
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)" },
          }}
        >
          {createInvite.isPending ? "생성 중..." : "초대 링크 만들기"}
        </Button>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{inviteUrl}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outlined"
              size="small"
              startIcon={<Copy className="h-3.5 w-3.5" />}
              onClick={handleCopy}
              sx={{ borderRadius: 2, textTransform: "none", fontFamily: "inherit" }}
            >
              링크 복사
            </Button>
            <a
              href={qrSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground no-underline hover:bg-muted"
            >
              <QrCode className="h-3.5 w-3.5" />
              QR 코드
            </a>
            <Button
              variant="outlined"
              size="small"
              startIcon={<MessageCircle className="h-3.5 w-3.5" />}
              onClick={handleKakaoShare}
              sx={{ borderRadius: 2, textTransform: "none", fontFamily: "inherit" }}
            >
              카카오톡으로 공유
            </Button>
          </div>
          {showQr && (
            <div className="flex justify-center rounded-xl border border-border bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrSrc} alt="초대 QR 코드" width={200} height={200} className="rounded" />
            </div>
          )}
          <Button
            variant="text"
            size="small"
            onClick={handleCreateLink}
            disabled={createInvite.isPending}
            sx={{ textTransform: "none", fontFamily: "inherit", fontSize: "0.75rem" }}
          >
            새 링크 만들기
          </Button>
        </div>
      )}
    </div>
  );
}
