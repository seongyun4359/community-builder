interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error || "요청에 실패했습니다.");
  return json.data as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeId<T extends Record<string, any>>(doc: T & { _id: string }): T & { id: string } {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id } as unknown as T & { id: string };
}
