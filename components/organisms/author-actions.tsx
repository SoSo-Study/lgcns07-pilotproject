"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import {
  deleteStudyAction,
  type DeleteStudyState,
} from "@/actions/study-write-actions";
import { SubmitButton } from "@/components/atoms/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";

// ② 상세 오른쪽 위 — 스터디장에게만 보이는 [수정] · [삭제] (#46)
// 버튼을 숨기는 건 안내일 뿐이고, 진짜로 막는 건 서버(액션 + 강사님 API 403)예요 (#45 B6)
export function AuthorActions({ studyId }: { studyId: number }) {
  const [state, formAction] = useActionState<DeleteStudyState, FormData>(
    deleteStudyAction,
    null,
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Link
          href={routes.studyEdit(studyId)}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Pencil aria-hidden />
          수정
        </Link>
        <form
          action={formAction}
          onSubmit={(event) => {
            if (!window.confirm("모집글을 삭제할까요? 되돌릴 수 없어요.")) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="studyId" value={studyId} />
          <SubmitButton size="sm" variant="destructive" pendingText="삭제 중…">
            <Trash2 aria-hidden />
            삭제
          </SubmitButton>
        </form>
      </div>
      {state && (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      )}
    </div>
  );
}
