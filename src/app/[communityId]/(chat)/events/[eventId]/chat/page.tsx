"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useChatQuery, useSendMessageMutation } from "@/queries/hooks";
import ChatBubble from "@/components/chat/ChatBubble";
import ChatInput from "@/components/chat/ChatInput";
import { Skeleton } from "@/components/ui/Loading";
import type { ChatMessage } from "@/types";

function shouldShowSender(messages: ChatMessage[], index: number): boolean {
  if (index === 0) return true;
  return messages[index].senderId !== messages[index - 1].senderId;
}

export default function EventChatPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = (Array.isArray(params.eventId) ? params.eventId[0] : params.eventId) as string | undefined;

  const listRef = useRef<HTMLDivElement>(null);
  const safeEventId = eventId ?? "";
  const { data, isLoading, isError } = useChatQuery(community.slug, safeEventId, !!user);
  const sendMessage = useSendMessageMutation(community.slug, safeEventId);

  useEffect(() => {
    if (!data?.messages?.length) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [data?.messages?.length, data?.messages]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage.mutateAsync(content);
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    } catch {
      // toast는 전역에서 처리 가능
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm text-muted-foreground">로그인 후 모임 채팅을 이용할 수 있어요</p>
        </div>
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm text-muted-foreground">모임을 찾을 수 없습니다.</p>
          <button
            type="button"
            onClick={() => router.replace(`/${community.slug}/events`)}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            모임으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-3 px-4 py-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-14 w-3/4 max-w-[280px] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="flex flex-col items-center gap-3 py-16">
          <p className="text-sm text-muted-foreground">채팅을 불러오지 못했습니다.</p>
          <p className="text-xs text-muted-foreground">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  const messages = data?.messages ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4" ref={listRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <p className="text-sm text-muted-foreground">아직 대화가 없어요</p>
            <p className="text-xs text-muted-foreground">첫 메시지를 보내보세요</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg, index) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isMine={msg.senderId === user.id}
                showSender={shouldShowSender(messages, index)}
              />
            ))}
          </div>
        )}
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={sendMessage.isPending}
        placeholder="메시지를 입력하세요"
      />
    </div>
  );
}

