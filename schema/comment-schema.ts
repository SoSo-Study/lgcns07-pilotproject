import { z } from "zod";

// 댓글 쓰기 검사 규칙 — 화면에서 먼저, 서버 액션에서 한 번 더 (#45 A4)
// 화면(입력칸 maxLength)과 서버 액션이 같은 숫자를 써요

/** 댓글 글자 수 상한 — 강사님 테스트 서버가 받는 길이 (11/12 QA #94: 1001자부터 거절) */
export const COMMENT_MAX = 1000;

export const commentSchema = z.object({
  studyId: z.coerce.number().int().positive(),
  content: z
    .string()
    .trim()
    .min(1, "댓글을 입력해 주세요")
    .max(COMMENT_MAX, `댓글은 ${COMMENT_MAX}자까지 쓸 수 있어요`),
});

// 댓글 삭제 (#111) — 어느 스터디의 어느 댓글인지 번호만 받아요. "누가"는 서버가 로그인 정보로 정해요
export const commentDeleteSchema = z.object({
  studyId: z.coerce.number().int().positive(),
  commentId: z.coerce.number().int().positive(),
});
