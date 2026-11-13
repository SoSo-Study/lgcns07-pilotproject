import Link from "next/link";
import { CommentForm } from "@/components/organisms/comment-form";
import { loadStudyComments } from "@/actions/study-social-actions";
import { CommentDeleteButton } from "@/components/molecules/comment-delete-button";
import { Panel } from "@/components/molecules/panel";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { timeAgo } from "@/lib/time-ago";

type CommentSectionProps = {
  studyId: number;
  isLoggedIn: boolean;
  /** 로그인한 사람의 번호 — 내 댓글에만 [삭제]를 보여 줘요 (로그인 안 했으면 없음) */
  myUserId?: number;
};

// 피그마 ② 소개 아래 "댓글 N" · 목록 · 입력칸 (#11)
// 🔒 댓글은 글자(text)로만 그려요 — HTML로 그리지 않아서 스크립트가 섞여도 실행되지 않아요 (XSS)
export async function CommentSection({
  studyId,
  isLoggedIn,
  myUserId,
}: CommentSectionProps) {
  const result = await loadStudyComments(studyId);
  const comments = result.data ?? [];

  return (
    <section aria-labelledby="comments-title" className="flex flex-col gap-4">
      <h2 id="comments-title" className="font-bold">
        댓글 {comments.length}
      </h2>

      {!result.success && (
        <p role="alert" className="text-sm text-destructive">
          {result.message}
        </p>
      )}

      {result.success && comments.length === 0 && (
        <p className="text-sm text-muted-foreground">
          아직 댓글이 없어요. 첫 댓글을 남겨 보세요.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-link-subtle font-mono text-xs font-bold text-link"
            >
              {comment.authorName.charAt(0).toUpperCase()}
            </span>
            <Panel
              as="article"
              className="min-w-0 flex-1"
              header={
                <div className="flex flex-wrap items-center justify-between gap-x-2">
                  <span>
                    <span className="font-mono font-bold text-foreground">
                      {comment.authorName}
                    </span>{" "}
                    <time dateTime={comment.createdAt}>
                      {timeAgo(comment.createdAt)}
                    </time>
                  </span>
                  {/* 내 댓글에만 [삭제] (#111) — 진짜로 막는 건 서버 액션이에요 */}
                  {comment.authorId === myUserId && (
                    <CommentDeleteButton
                      studyId={studyId}
                      commentId={comment.id}
                    />
                  )}
                </div>
              }
            >
              <p className="wrap-break-word whitespace-pre-line">
                {comment.content}
              </p>
            </Panel>
          </li>
        ))}
      </ul>

      {isLoggedIn ? (
        <CommentForm studyId={studyId} />
      ) : (
        <div className="flex justify-end">
          <Link
            href={`${routes.login}?callbackUrl=${encodeURIComponent(routes.study(studyId))}`}
            className={buttonVariants({ variant: "outline" })}
          >
            로그인하고 댓글 쓰기
          </Link>
        </div>
      )}
    </section>
  );
}
