import { z } from "zod";

// 목록 주소의 조건 검사 규칙: /studies?q=리액트&category=FRONTEND&sort=oldest&page=2
// 주소는 누구나 손으로 바꿀 수 있어요(?page=abc, ?sort=이상한값).
// 이상한 값이 와도 오류를 내지 않고 기본값으로 바꿔요(.catch) → 화면이 깨지지 않아요.
export const studyListQuerySchema = z.object({
  q: z.string().trim().max(30).catch(""), // 검색어 (최대 30자)
  category: z
    .enum(["FRONTEND", "BACKEND", "ALGORITHM", "CS", "INTERVIEW"])
    .optional()
    .catch(undefined), // 분야 (없으면 전체)
  sort: z.enum(["latest", "oldest"]).catch("latest"), // 최신순(기본) / 오래된순
  page: z.coerce.number().int().min(1).catch(1), // 쪽 번호 (1부터)
});
