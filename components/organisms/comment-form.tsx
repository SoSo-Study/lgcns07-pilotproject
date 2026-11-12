"use client";

import { useActionState } from "react";
import {
  addCommentAction,
  type CommentState,
} from "@/actions/study-social-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { COMMENT_MAX } from "@/schema/comment-schema";

// 피그마 ② 댓글 입력칸 + [댓글 남기기] (#11)
// 폼 하나에 서버 액션 하나 (폼 안에 폼 X) · 보내는 동안 버튼 잠금(연타 방지)
// 칸 비우기는 React가 해요 — <form action>이 끝나면 비제어 칸을 스스로 비워서 ref · reset()이 필요 없어요
export function CommentForm({ studyId }: { studyId: number }) {
  const [state, formAction] = useActionState<CommentState, FormData>(
    addCommentAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="studyId" value={studyId} />
      <label htmlFor="comment" className="sr-only">
        댓글
      </label>
      <Textarea
        id="comment"
        name="content"
        required
        maxLength={COMMENT_MAX}
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
