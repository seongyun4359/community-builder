"use client";

import { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled, placeholder = "메시지를 입력하세요" }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 border-t border-border bg-background p-3"
    >
      <TextField
        inputRef={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth
        multiline
        maxRows={4}
        size="small"
        slotProps={{
          input: {
            className: "py-2.5 text-sm",
            style: { fontFamily: "inherit" },
          },
          htmlInput: {
            className: "min-h-[40px]",
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "var(--muted)",
            borderRadius: "20px",
            "& fieldset": { borderColor: "var(--border)" },
          },
        }}
      />
      <IconButton
        type="submit"
        disabled={!value.trim() || disabled}
        sx={{
          bgcolor: "var(--primary)",
          color: "var(--primary-foreground)",
          "&:hover": { bgcolor: "var(--primary)", opacity: 0.9 },
          "&.Mui-disabled": { bgcolor: "var(--muted)", color: "var(--muted-foreground)" },
        }}
      >
        <SendIcon />
      </IconButton>
    </form>
  );
}
