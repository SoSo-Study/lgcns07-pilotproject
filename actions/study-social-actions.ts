"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";
import { getServerAuth } from "@/lib/auth-session";
import { commentDeleteSchema, commentSchema } from "@/schema/comment-schema";
import {
  createStudyComment,
  deleteStudyComment,
  getStudyComments,
  toggleStudyBookmark,
} from "@/service/study-service";
import type { BookmarkResult } from "@/types/study";

// ② 댓글 · 찜 (#11) — 화면 → 여기 → service → 강사님 API
// 🔒 작성자 · "나"는 폼이 아니라 서버가 토큰으로 정해요 (#45 B7)

const LOGIN_REQUIRED = "로그인이 필요해요.";

// 댓글 목록 (누구나) — 실패하면 화면이 문구를 보여 줘요
export async function loadStudyComments(studyId: number) {
  return getStudyComments(studyId);
}

// ── 댓글 쓰기 ──
export type CommentState = { ok?: boolean; message?: string };

export async function addCommentAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  // 1. 화면과 같은 규칙으로 서버에서 다시 검사
  const parsed = commentSchema.safeParse({
    studyId: formData.get("studyId"),
    content: formData.get("content"),
  });
  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "다시 확인해 주세요.",
    };
  }

  // 2. 로그인 확인 (화면에서도 안내하지만 진짜 막는 건 여기)
  const auth = await getServerAuth();
  if (!auth) return { message: LOGIN_REQUIRED };

  // 3. 저장 → 상세 화면 다시 그리기 (댓글 목록 · 댓글 수)
  const result = await createStudyComment(
    auth.accessToken,
    parsed.data.studyId,
    parsed.data.content,
  );
  if (!result.success) return { message: result.message };

  revalidatePath(routes.study(parsed.data.studyId));
  return { ok: true };
}

// ── 댓글 삭제 (#111) ──
// ⚠ 11/13 기준 강사님 API에 댓글 삭제가 아직 없어요. 화면 · 액션 · 서비스는 다 만들어 뒀고,
//   API가 생기면 config/api-paths.ts의 주소만 맞는지 확인하면 바로 동작해요.
const COMMENT_DELETE_NOT_READY = "댓글 삭제는 아직 서버에서 준비 중이에요.";

export async function deleteCommentAction(
  _prev: CommentState,
  formData: FormData,
): Promise<CommentState> {
  // 1. 번호 검사 (화면을 거치지 않고 직접 불러도 막혀요)
  const parsed = commentDeleteSchema.safeParse({
    studyId: formData.get("studyId"),
    commentId: formData.get("commentId"),
  });
  if (!parsed.success) {
    return { message: "잘못된 요청이에요. 새로고침 후 다시 시도해 주세요." };
  }
  const { studyId, commentId } = parsed.data;

  // 2. 로그인 확인
  const auth = await getServerAuth();
  if (!auth) return { message: LOGIN_REQUIRED };

  // 3. 내 댓글인지 확인 — 버튼을 숨기는 건 안내일 뿐이라 서버에서 한 번 더 (#45 B6)
  //    "나"는 폼이 아니라 로그인 정보(auth.userId)로 정해요
  const comments = await getStudyComments(studyId);
  if (!comments.success || !comments.data) {
    return { message: comments.message || "댓글을 확인하지 못했어요." };
  }
  const comment = comments.data.find((item) => item.id === commentId);
  if (!comment) return { message: "이미 지워진 댓글이에요." };
  if (comment.authorId !== auth.userId) {
    return { message: "내가 쓴 댓글만 지울 수 있어요." };
  }

  // 4. 삭제 → 상세 화면 다시 그리기 (댓글 목록 · 댓글 수)
  const result = await deleteStudyComment(auth.accessToken, studyId, commentId);
  if (!result.success) {
    // 없는 주소면 서버가 영어 오류(NoResourceFoundException)나 405를 줘요 → 알아들을 수 있는 말로
    const notReady =
      result.status === 405 ||
      result.message.includes("NoResourceFoundException");
    return { message: notReady ? COMMENT_DELETE_NOT_READY : result.message };
  }

  revalidatePath(routes.study(studyId));
  return { ok: true };
}

// ── 찜 ──
export type BookmarkActionResult =
  { ok: true; data: BookmarkResult } | { ok: false; message: string };

export async function toggleBookmarkAction(
  studyId: number,
): Promise<BookmarkActionResult> {
  if (!Number.isInteger(studyId) || studyId <= 0) {
    return { ok: false, message: "잘못된 요청이에요." };
  }

  const auth = await getServerAuth();
  if (!auth) return { ok: false, message: LOGIN_REQUIRED };

  const result = await toggleStudyBookmark(auth.accessToken, studyId);
  if (!result.success || !result.data) {
    return { ok: false, message: result.message || "찜하지 못했어요." };
  }
  revalidatePath(routes.study(studyId));
  return { ok: true, data: result.data };
}
