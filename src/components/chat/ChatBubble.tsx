"use client";

import Avatar from "@mui/material/Avatar";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  showSender?: boolean;
}

export default function ChatBubble({ message, isMine, showSender }: ChatBubbleProps) {
  const time = new Date(message.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isMine) {
    return (
      <div className="flex justify-end gap-1.5">
        <div className="flex max-w-[80%] flex-col items-end gap-0.5">
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5",
              "rounded-br-md",
              "bg-primary text-primary-foreground shadow-sm"
            )}
          >
            <p className="whitespace-pre-wrap wrap-break-word text-sm">{message.content}</p>
          </div>
          <span className="text-[10px] text-muted-foreground">{time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-2">
      {showSender && message.sender ? (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: "0.75rem",
            bgcolor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {message.sender.nickname?.[0]?.toUpperCase() ?? "?"}
        </Avatar>
      ) : (
        <div className="w-8 shrink-0" />
      )}
      <div className="flex max-w-[80%] flex-col gap-0.5">
        {showSender && message.sender && (
          <span className="text-[10px] font-medium text-muted-foreground">
            {message.sender.nickname}
          </span>
        )}
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5",
            "rounded-bl-md",
            "border border-border bg-card text-card-foreground shadow-sm"
          )}
        >
          <p className="whitespace-pre-wrap wrap-break-word text-sm">{message.content}</p>
        </div>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}
