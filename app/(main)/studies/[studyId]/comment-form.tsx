"use client";

import { useActionState, useRef } from "react";
import {
  addCommentAction,
  type CommentState,
} from "@/actions/study-social-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { Textarea } from "@/components/ui/textarea";

const MAX_LENGTH = 2000;

// 피그마 ② 댓글 입력칸 + [댓글 남기기] (#11)
// 폼 하나에 서버 액션 하나 (폼 안에 폼 X) · 보내는 동안 버튼 잠금(연타 방지) · 성공하면 칸 비우기
export function CommentForm({ studyId }: { studyId: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<CommentState, FormData>(
    async (prev, formData) => {
      const result = await addCommentAction(prev, formData);
      if (result.ok) formRef.current?.reset();
      return result;
    },
    {},
  );

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="studyId" value={studyId} />
      <label htmlFor="comment" className="sr-only">
        댓글
      </label>
      <Textarea
        id="comment"
        name="content"
        required
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="궁금한 점을 남겨 주세요"
        className="bg-inset dark:bg-inset"
      />
      {state.message && (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
      <div className="flex justify-end">
        <SubmitButton variant="outline" pendingText="남기는 중…">
          댓글 남기기
        </SubmitButton>
      </div>
    </form>
  );
}
