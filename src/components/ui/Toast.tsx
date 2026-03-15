"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const iconMap: Record<ToastType, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-[var(--success)]" },
  error: { icon: XCircle, className: "text-[var(--destructive)]" },
  info: { icon: Info, className: "text-[var(--primary)]" },
  warning: { icon: AlertTriangle, className: "text-[var(--warning)]" },
};

export default function Toast({
  id,
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const fadeOutTimer = setTimeout(() => setIsVisible(false), duration - 300);
    const closeTimer = setTimeout(() => onClose(id), duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [id, duration, onClose]);

  const { icon: Icon, className: iconClass } = iconMap[type];

  return (
    <div
      className={`flex items-center gap-2.5 rounded-2xl border border-border bg-card/95 px-4 py-2.5 text-foreground shadow-lg ring-1 ring-border/50 backdrop-blur-xl transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      role="status"
      aria-live="polite"
    >
      <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
      <span className="whitespace-nowrap text-[13px] font-medium">
        {message}
      </span>
    </div>
  );
}
