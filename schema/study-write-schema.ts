import { z } from "zod";

// ③ 모집글 등록 · 수정 검사 규칙 — 화면에서 먼저, 서버 액션에서 한 번 더 (#45 A4)
// 숫자는 강사님 스웨거(CreateStudyRequest)와 같아요: 제목 100자 · 태그 5개 · 인원 2~10명 · 소개 2000자
// 보내는 값은 코드(FRONTEND · ONLINE)와 숫자(5) — 한국어는 화면에서만 (#14 팀 결정)

/** 오늘 날짜(한국 시간) "2026-11-11" — 서버는 UTC라 직접 구해요 */
function todayInSeoul() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

export const studyWriteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요")
    .max(100, "제목은 100자까지 쓸 수 있어요"),
  category: z.enum(["FRONTEND", "BACKEND", "ALGORITHM", "CS", "INTERVIEW"], {
    message: "분야를 골라 주세요",
  }),
  maxMembers: z.coerce
    .number({ message: "모집 인원을 골라 주세요" })
    .int("모집 인원을 골라 주세요")
    .min(2, "모집 인원은 2~10명이에요")
    .max(10, "모집 인원은 2~10명이에요"),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "마감일을 골라 주세요")
    .refine(
      (date) => date >= todayInSeoul(),
      "마감일은 오늘부터 고를 수 있어요",
    ),
  mode: z.enum(["ONLINE", "OFFLINE", "BOTH"], {
    message: "진행 방식을 골라 주세요",
  }),
  techTags: z
    .array(z.string().trim().min(1).max(20, "태그는 20자까지 쓸 수 있어요"))
    .max(5, "태그는 5개까지 넣을 수 있어요"),
  content: z
    .string()
    .trim()
    .min(1, "소개를 입력해 주세요")
    .max(2000, "소개는 2000자까지 쓸 수 있어요"),
});

export type StudyWriteValues = z.infer<typeof studyWriteSchema>;

/** 폼(FormData) → 검사할 값 모양 (태그는 쉼표로 이어 붙여 와요) */
export function readStudyWriteForm(formData: FormData) {
  const tags = String(formData.get("techTags") ?? "");
  return {
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    maxMembers: formData.get("maxMembers"),
    deadline: String(formData.get("deadline") ?? ""),
    mode: String(formData.get("mode") ?? ""),
    techTags: tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [],
    content: String(formData.get("content") ?? ""),
  };
}
