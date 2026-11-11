import { routes } from "@/config/routes";
import type { StudyListQuery } from "@/types/study";

// 목록 조건 → 주소. 기본값(최신순 · 1쪽 · 빈 검색어)은 주소에 넣지 않아 짧게 유지해요.
// studiesHref({ q: "리액트", page: 2 }) → "/studies?q=리액트&page=2"
export function studiesHref(query: StudyListQuery = {}) {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sort === "oldest") params.set("sort", query.sort);
  if (query.page && query.page > 1) params.set("page", String(query.page));

  const search = params.toString();
  return search ? `${routes.studies}?${search}` : routes.studies;
}
