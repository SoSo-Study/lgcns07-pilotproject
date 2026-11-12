import { z } from "zod";

// 댓글 쓰기 검사 규칙 — 화면에서 먼저, 서버 액션에서 한 번 더 (#45 A4)
// 숫자는 강사님 스웨거 CreateCommentRequest와 같게 (2000자)
export const commentSchema = z.object({
  studyId: z.coerce.number().int().positive(),
  content: z
    .string()
    .trim()
    .min(1, "댓글을 입력해 주세요")
    .max(2000, "댓글은 2000자까지 쓸 수 있어요"),
});
