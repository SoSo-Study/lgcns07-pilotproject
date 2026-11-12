import { z } from "zod";

// 참여 신청 폼 (#8) — 한 줄 소개는 ④ 신청자 관리 표에 보여요
// 화면(글자 수 세기 · maxLength)과 서버 액션이 같은 숫자를 써요
export const APPLY_MESSAGE_MAX = 50;

export const applySchema = z.object({
  studyId: z.coerce.number().int().positive(),
  message: z
    .string()
    .trim()
    .min(1, "한 줄 소개를 적어 주세요.")
    .max(APPLY_MESSAGE_MAX, `한 줄 소개는 ${APPLY_MESSAGE_MAX}자까지예요.`),
});

// 신청 승인 · 거절 폼 검사 규칙 (서버 액션에서 한 번 더 검사)
// 폼에서 오는 값은 전부 글자라서, 번호는 숫자로 바꿔서(coerce) 검사해요.
export const decideApplicationSchema = z.object({
  applicationId: z.coerce.number().int().positive(),
  decision: z.enum(["APPROVED", "REJECTED"]),
});
