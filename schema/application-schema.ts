import { z } from "zod";

// 신청 승인 · 거절 폼 검사 규칙 (서버 액션에서 한 번 더 검사)
// 폼에서 오는 값은 전부 글자라서, 번호는 숫자로 바꿔서(coerce) 검사해요.
export const decideApplicationSchema = z.object({
  applicationId: z.coerce.number().int().positive(),
  decision: z.enum(["APPROVED", "REJECTED"]),
});
