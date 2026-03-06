"use client";

import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Plus, Users } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { fetchEvents, createEvent } from "@/services/event";
import type { CommunityEvent } from "@/types";

export default function EventsPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", startDate: "", maxParticipants: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents(community.slug)
      .then(setEvents)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [community.slug]);

  const handleCreate = async () => {
    if (!form.title.trim()) { toast.error("모임 이름을 입력해주세요."); return; }
    if (!form.startDate) { toast.error("날짜를 선택해주세요."); return; }
    if (!user) { toast.error("로그인이 필요합니다."); return; }

    setIsSubmitting(true);
    try {
      const newEvent = await createEvent(community.slug, {
        title: form.title,
        description: form.description,
        location: form.location || undefined,
        startDate: form.startDate,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
      });
      setEvents((prev) => [newEvent, ...prev]);
      setShowForm(false);
      setForm({ title: "", description: "", location: "", startDate: "", maxParticipants: "" });
      toast.success("모임이 생성되었습니다.");
    } catch {
      toast.error("모임 생성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">모임</h1>
        <Button variant="contained" size="small" startIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(!showForm)}
          sx={{ borderRadius: "12px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}>
          모임 만들기
        </Button>
      </div>

      {showForm && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <TextField label="모임 이름" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth size="small" slotProps={{ input: { style: { fontFamily: "inherit" } } }} />
          <TextField label="설명" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth size="small" multiline minRows={2} slotProps={{ input: { style: { fontFamily: "inherit" } } }} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="날짜" type="datetime-local" value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              fullWidth size="small" slotProps={{ inputLabel: { shrink: true }, input: { style: { fontFamily: "inherit" } } }} />
            <TextField label="장소 (선택)" value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              fullWidth size="small" slotProps={{ input: { style: { fontFamily: "inherit" } } }} />
          </div>
          <TextField label="최대 인원 (선택)" type="number" value={form.maxParticipants}
            onChange={(e) => setForm((f) => ({ ...f, maxParticipants: e.target.value }))}
            fullWidth size="small" slotProps={{ input: { style: { fontFamily: "inherit" } } }} />
          <div className="flex justify-end gap-2">
            <Button variant="outlined" size="small" onClick={() => setShowForm(false)}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit" }}>취소</Button>
            <Button variant="contained" size="small" onClick={handleCreate} disabled={isSubmitting}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}>
              {isSubmitting ? "생성 중..." : "만들기"}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <CalendarDays className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">예정된 모임이 없습니다</p>
          <p className="text-xs text-muted-foreground">모임을 만들어 멤버들과 함께 해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((evt) => (
            <div key={evt.id} className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
              <span className="text-sm font-semibold">{evt.title}</span>
              {evt.description && <span className="text-xs text-muted-foreground">{evt.description}</span>}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(evt.startDate).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" })}
                </span>
                {evt.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{evt.location}</span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {evt.participantCount}{evt.maxParticipants ? `/${evt.maxParticipants}` : ""}명
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
