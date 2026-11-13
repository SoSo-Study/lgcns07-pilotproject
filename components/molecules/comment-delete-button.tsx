"use client";

import { useActionState, type ComponentProps, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteCommentAction,
  type CommentState,
} from "@/actions/study-social-actions";
import { IconButton } from "@/components/atoms/icon-button";
import { cn } from "@/lib/utils";

type CommentDeleteButtonProps = Omit<
  ComponentProps<"form">,
  "action" | "onSubmit" | "children"
> & {
  studyId: number;
  commentId: number;
};

/**
 * 댓글 하나의 [삭제] 버튼 (#111) — 내가 쓴 댓글에만 보여 줘요 (보여 줄지는 쓰는 쪽이 정해요).
 * 누르면 확인을 묻고, 보내는 동안 잠겨요. 실패하면 버튼 왼쪽에 이유가 나와요.
 * 🔒 버튼을 숨기는 건 안내일 뿐이고, 진짜로 막는 건 서버 액션(로그인 · 내 댓글인지 확인)이에요.
 *
 * @example
 * {comment.authorId === myUserId && (
 *   <CommentDeleteButton studyId={studyId} commentId={comment.id} />
 * )}
 */
export function CommentDeleteButton({
  studyId,
  commentId,
  className,
  ...props
}: CommentDeleteButtonProps) {
  const [state, formAction, isPending] = useActionState<CommentState, FormData>(
    deleteCommentAction,
    {},
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("댓글을 삭제할까요? 되돌릴 수 없어요.")) {
      event.preventDefault(); // 취소하면 보내지 않아요
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <input type="hidden" name="studyId" value={studyId} />
      <input type="hidden" name="commentId" value={commentId} />
      {state.message && (
        <span role="alert" className="text-destructive">
          {state.message}
        </span>
      )}
      <IconButton
        type="submit"
        size="sm"
        icon={<Trash2 />}
        label="댓글 삭제"
        pending={isPending}
        // -my-1.5: 버튼이 있어도 댓글 머리줄 높이가 그대로이게
        className="-my-1.5 text-muted-foreground hover:text-destructive"
      />
    </form>
  );
}
