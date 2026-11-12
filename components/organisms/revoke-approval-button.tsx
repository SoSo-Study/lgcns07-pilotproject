"use client";

import { useActionState } from "react";
import {
  decideApplicationAction,
  type DecideState,
} from "@/actions/application-actions";
import { SubmitButton } from "@/components/atoms/submit-button";

type RevokeApprovalButtonProps = {
  applicationId: number;
};

// [승인 취소] — 이미 승인한 신청을 되돌려요 (API 요청 16번, #82)
// 보내는 값은 [거절]과 같아요 (status: REJECTED). 서버가 APPROVED → REJECTED를 허락하고,
// 인원 -1 · 마감일 전이면 다시 모집 중으로 바꿔 줘요.
// 승인 취소된 사람은 "거절됨"이 되어 같은 스터디에 다시 신청할 수 없어서, 한 번 더 확인해요.
export function RevokeApprovalButton({
  applicationId,
}: RevokeApprovalButtonProps) {
  const [state, formAction] = useActionState<DecideState, FormData>(
    decideApplicationAction,
    null,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "승인을 취소하면 참여 인원에서 빠지고, 이 스터디에 다시 신청할 수 없어요. 취소할까요?",
          )
        ) {
          event.preventDefault();
        }
      }}
      className="flex flex-col items-start gap-1"
    >
      <input type="hidden" name="applicationId" value={applicationId} />
      <input type="hidden" name="decision" value="REJECTED" />
      <SubmitButton size="sm" variant="outline" pendingText="취소 중…">
        승인 취소
      </SubmitButton>
      {state && (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
