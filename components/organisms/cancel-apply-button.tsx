"use client";

import { useActionState } from "react";
import {
  cancelFromDetailAction,
  type ApplyState,
} from "@/actions/application-actions";
import { SubmitButton } from "@/components/atoms/submit-button";

type CancelApplyButtonProps = {
  studyId: number;
  approved: boolean; // 승인된 뒤 취소면 한 번 더 확인해요 (내 자리가 다른 사람에게 갈 수 있어서)
};

// [신청 취소] · [참여 취소] — ⑧ 프로필의 취소 버튼과 같은 모양 · 동작
export function CancelApplyButton({
  studyId,
  approved,
}: CancelApplyButtonProps) {
  const [state, formAction] = useActionState<ApplyState, FormData>(
    cancelFromDetailAction,
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
      className="flex flex-col gap-1"
    >
      <input type="hidden" name="studyId" value={studyId} />
      <SubmitButton variant="outline" className="w-full" pendingText="취소 중…">
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
