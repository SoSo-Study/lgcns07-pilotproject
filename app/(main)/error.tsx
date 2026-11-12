"use client";

import { EmptyState } from "@/components/templates/empty-state";
import { Button } from "@/components/ui/button";

// 화면을 그리다 오류가 나면(예: 강사님 서버와 연결이 안 될 때) 빨간 오류 화면 대신 보여 줘요
// 오류 내용(error.message)은 화면에 그대로 내보내지 않아요 — 내부 정보가 섞일 수 있어서요 (#45)
// error.tsx는 Next 규칙상 클라이언트 컴포넌트여야 해요 ("다시 시도" 버튼)
export default function MainError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-md border border-border bg-card">
      <EmptyState
        title="잠시 문제가 생겼어요"
        description="서버와 연결하지 못했어요. 잠시 후 다시 시도해 주세요."
        action={
          <Button variant="outline" onClick={reset}>
            다시 시도
          </Button>
        }
      />
    </div>
  );
}
