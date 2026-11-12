"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";
import { getServerAuth } from "@/lib/auth-session";
import { commentSchema } from "@/schema/comment-schema";
import {
  createStudyComment,
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
