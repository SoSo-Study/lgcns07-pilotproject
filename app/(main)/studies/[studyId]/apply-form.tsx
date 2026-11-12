"use client";

import { useActionState, useState } from "react";
import { applyAction, type ApplyState } from "@/actions/application-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { APPLY_MESSAGE_MAX } from "@/schema/application-schema";

// [참여 신청하기] 폼 — 한 줄 소개(최대 50자)를 같이 보내요 (#8)
// 보내는 동안 버튼이 잠겨서(SubmitButton) 연타가 안 되고, 실패하면 서버 문구를 아래에 보여 줘요
export function ApplyForm({ studyId }: { studyId: number }) {
  const [state, formAction] = useActionState<ApplyState, FormData>(
    applyAction,
    null,
  );
  const [message, setMessage] = useState(""); // 글자 수 세기용

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="studyId" value={studyId} />
      <label htmlFor="apply-message" className="text-xs text-muted-foreground">
        한 줄 소개 (스터디장에게 보여요)
      </label>
      <Textarea
        id="apply-message"
        name="message"
        rows={2}
        required
        maxLength={APPLY_MESSAGE_MAX}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="예: 매주 빠지지 않고 참여할게요!"
        aria-describedby="apply-message-count"
      />
      <p
        id="apply-message-count"
        className="text-right font-mono text-xs text-muted-foreground"
      >
        {message.length} / {APPLY_MESSAGE_MAX}
      </p>
      <SubmitButton className="w-full" pendingText="신청 중…">
        참여 신청하기
      </SubmitButton>
      {state && (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
    </form>
  );
}
