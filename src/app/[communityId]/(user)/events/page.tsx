"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Plus, Users } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormError from "@/components/ui/FormError";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Loading";
import { useCreateEventMutation, useEventsQuery } from "@/queries/hooks";

const TITLE_MAX = 40;
const DESCRIPTION_MAX = 300;
const LOCATION_MAX = 60;

export default function EventsPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const { data: events = [], isLoading } = useEventsQuery(community.slug);
  const createMutation = useCreateEventMutation(community.slug);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", startDate: "", maxParticipants: "" });
  const [touched, setTouched] = useState({ title: false, startDate: false });

  const titleError = !form.title.trim()
    ? "모임 이름을 입력해주세요."
    : form.title.length > TITLE_MAX
      ? `모임 이름은 최대 ${TITLE_MAX}자입니다.`
      : "";

  const startDateError = !form.startDate ? "날짜를 선택해주세요." : "";

  const handleCreate = async () => {
    setTouched({ title: true, startDate: true });
    if (titleError || startDateError) {
      toast.error("입력값을 확인해주세요.");
      return;
    }
    if (!user) { toast.error("로그인이 필요합니다."); return; }

    try {
      await createMutation.mutateAsync({
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location || undefined,
        startDate: form.startDate,
        maxParticipants: form.maxParticipants ? parseInt(form.maxParticipants) : undefined,
      });
      setShowForm(false);
      setForm({ title: "", description: "", location: "", startDate: "", maxParticipants: "" });
      toast.success("모임이 생성되었습니다.");
    } catch {
      toast.error("모임 생성에 실패했습니다.");
    }
  };

  const canSubmit = useMemo(() => !createMutation.isPending, [createMutation.isPending]);

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">모임</h1>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(!showForm)}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: 600,
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            "&:hover": {
              backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)",
            },
          }}
        >
          모임 만들기
        </Button>
      </div>

      {showForm && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <TextField
            label="모임 이름"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            fullWidth
            size="small"
            error={touched.title && !!titleError}
            helperText={`${form.title.length}/${TITLE_MAX}`}
            inputProps={{ maxLength: TITLE_MAX }}
            slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
          />
          <FormError message={touched.title ? titleError : ""} />
          <TextField
            label="설명"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
            size="small"
            multiline
            minRows={2}
            helperText={`${form.description.length}/${DESCRIPTION_MAX}`}
            inputProps={{ maxLength: DESCRIPTION_MAX }}
            slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="날짜"
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              onBlur={() => setTouched((t) => ({ ...t, startDate: true }))}
              fullWidth
              size="small"
              error={touched.startDate && !!startDateError}
              helperText={touched.startDate ? startDateError : " "}
              slotProps={{
                inputLabel: { shrink: true },
                input: { style: { fontFamily: "inherit" } },
                formHelperText: { style: { fontFamily: "inherit" } },
              }}
            />
            <TextField
              label="장소 (선택)"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              fullWidth
              size="small"
              helperText={`${form.location.length}/${LOCATION_MAX}`}
              inputProps={{ maxLength: LOCATION_MAX }}
              slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
            />
          </div>
          <TextField label="최대 인원 (선택)" type="number" value={form.maxParticipants}
            onChange={(e) => setForm((f) => ({ ...f, maxParticipants: e.target.value }))}
            fullWidth size="small"
            inputProps={{ min: 1, max: 9999 }}
            slotProps={{ input: { style: { fontFamily: "inherit" } } }} />
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowForm(false)}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "inherit",
                borderColor: "var(--border)",
                color: "var(--muted-foreground)",
                "&:hover": {
                  borderColor: "var(--border)",
                  backgroundColor: "var(--muted)",
                },
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleCreate}
              disabled={!canSubmit}
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                fontFamily: "inherit",
                fontWeight: 600,
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                "&:hover": {
                  backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)",
                },
              }}
            >
              {createMutation.isPending ? "생성 중..." : "만들기"}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
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
            <button
              key={evt.id}
              type="button"
              onClick={() => router.push(`/${community.slug}/events/${evt.id}/chat`)}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/60"
            >
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
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
