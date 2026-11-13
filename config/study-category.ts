import type { StudyCategory } from "@/types/study";

// 분야별 이름과 색 클래스.
// ⚠ Tailwind는 "완성된 클래스 이름"만 찾아요. `bg-category-${key}`처럼 조립하면 색이 안 나와요.
//    그래서 여기에 클래스 이름을 통째로 적어 두고 꺼내 씁니다.
export const studyCategories: Record<
  StudyCategory,
  { label: string; dot: string; text: string; chip: string }
> = {
  FRONTEND: {
    label: "프론트엔드",
    dot: "bg-category-frontend",
    text: "text-category-frontend",
    chip: "bg-category-frontend-subtle text-category-frontend border-category-frontend",
  },
  BACKEND: {
    label: "백엔드",
    dot: "bg-category-backend",
    text: "text-category-backend",
    chip: "bg-category-backend-subtle text-category-backend border-category-backend",
  },
  ALGORITHM: {
    label: "알고리즘",
    dot: "bg-category-algorithm",
    text: "text-category-algorithm",
    chip: "bg-category-algorithm-subtle text-category-algorithm border-category-algorithm",
  },
  CS: {
    label: "CS",
    dot: "bg-category-cs",
    text: "text-category-cs",
    chip: "bg-category-cs-subtle text-category-cs border-category-cs",
  },
  INTERVIEW: {
    label: "면접",
    dot: "bg-category-interview",
    text: "text-category-interview",
    chip: "bg-category-interview-subtle text-category-interview border-category-interview",
  },
};

/** 분야를 보여 줄 순서 — 위 표에 적은 순서 그대로. 분야를 늘리면 표에만 더하면 돼요 */
export const studyCategoryList = Object.keys(
  studyCategories,
) as StudyCategory[];
