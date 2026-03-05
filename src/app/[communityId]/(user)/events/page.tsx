"use client";

import { CalendarDays, Plus } from "lucide-react";
import Button from "@mui/material/Button";
import { useToast } from "@/hooks/useToast";

export default function EventsPage() {
  const toast = useToast();

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">모임</h1>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => toast.info("모임 만들기 기능은 준비 중입니다.")}
          sx={{ borderRadius: "12px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}
        >
          모임 만들기
        </Button>
      </div>

      <div className="flex flex-col items-center gap-3 py-16">
        <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">예정된 모임이 없습니다</p>
        <p className="text-xs text-muted-foreground">모임을 만들어 멤버들과 함께 해보세요</p>
      </div>
    </div>
  );
}
