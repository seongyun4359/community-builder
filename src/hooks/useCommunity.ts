"use client";

import { createContext, useContext } from "react";
import type { Community } from "@/types";

export const CommunityContext = createContext<Community | null>(null);

export function useCommunity(): Community {
  const ctx = useContext(CommunityContext);
  if (!ctx) {
    throw new Error("useCommunity must be used within a CommunityLayout");
  }
  return ctx;
}
