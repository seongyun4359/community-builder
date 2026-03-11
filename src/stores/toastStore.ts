"use client";

import { create } from "zustand";
import type { ToastType } from "@/components/ui/Toast";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
  toast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  remove: (id: string) => void;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useToastStore = create<ToastState>((set) => {
  const push = (message: string, type: ToastType, duration?: number) => {
    const id = createId();
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }));
  };

  return {
  toasts: [],
    toast: (message, type = "info", duration) => push(message, type, duration),
    success: (message, duration) => push(message, "success", duration),
    error: (message, duration) => push(message, "error", duration),
    info: (message, duration) => push(message, "info", duration),
    warning: (message, duration) => push(message, "warning", duration),
    remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  };
});

