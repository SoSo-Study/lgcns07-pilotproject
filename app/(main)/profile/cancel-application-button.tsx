"use client";

import { useActionState } from "react";
import {
  cancelApplicationAction,
  type CancelState,
} from "@/actions/profile-actions";
import { SubmitButton } from "@/components/atoms/submit-button";

type CancelApplicationButtonProps = {
  studyId: number;
  approved: boolean; // 승인된 뒤 취소면 한 번 더 확인해요 (자리가 다른 사람에게 갈 수 있어서)
};

// [신청 취소] — 누르는 동안 잠겨서 연타가 안 돼요(SubmitButton). 실패하면 서버 문구를 아래에
export function CancelApplicationButton({
  studyId,
  approved,
}: CancelApplicationButtonProps) {
  const [state, formAction] = useActionState<CancelState, FormData>(
    cancelApplicationAction,
    null,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          approved &&
          !window.confirm("승인된 스터디예요. 정말 참여를 취소할까요?")
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-1"
    >
      <input type="hidden" name="studyId" value={studyId} />
      <SubmitButton size="sm" variant="outline" pendingText="취소 중…">
        {approved ? "참여 취소" : "신청 취소"}
      </SubmitButton>
      {state && (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
