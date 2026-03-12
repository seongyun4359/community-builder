import { Suspense } from "react";
import JoinClient from "./JoinClient";

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex w-full max-w-md flex-col items-center gap-6">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-sm text-muted-foreground">초대 정보를 불러오는 중...</p>
        </div>
      }
    >
      <JoinClient />
    </Suspense>
  );
}
