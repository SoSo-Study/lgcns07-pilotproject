"use client";

import { useActionState } from "react";
import {
  decideApplicationAction,
  type DecideState,
} from "@/actions/application-actions";
import { Button } from "@/components/ui/button";

type DecisionButtonsProps = {
  applicationId: number;
  canApprove: boolean; // 자리가 다 찼으면 false → [승인]만 막아요 (거절은 언제나 가능)
};

// 신청자 표의 [승인] · [거절] 버튼
// 버튼을 누르는 동안(pending) 둘 다 막아서 연타를 방지하고,
// 실패하면 서버가 준 문구를 버튼 아래에 보여 줘요.
// useActionState는 브라우저에서 동작하는 훅이라 이 파일만 "use client"예요.
export function DecisionButtons({
  applicationId,
  canApprove,
}: DecisionButtonsProps) {
  const [state, formAction, pending] = useActionState<DecideState, FormData>(
    decideApplicationAction,
    null,
  );

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <input type="hidden" name="applicationId" value={applicationId} />
      <span className="flex gap-2">
        <Button
          type="submit"
          name="decision"
          value="APPROVED"
          size="sm"
          disabled={pending || !canApprove}
          title={canApprove ? undefined : "모집 인원이 다 찼어요"}
        >
          승인
        </Button>
        <Button
          type="submit"
          name="decision"
          value="REJECTED"
          size="sm"
          variant="outline"
          disabled={pending}
        >
          거절
        </Button>
      </span>
      {pending && (
        <span className="text-xs text-muted-foreground">처리 중…</span>
      )}
      {state && !pending && (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
