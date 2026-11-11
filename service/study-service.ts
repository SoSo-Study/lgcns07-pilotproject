import type { ApiResponse } from "@/types/api-response";
import type {
  Study,
  StudyCategory,
  StudyListData,
  StudyListQuery,
  StudySummary,
} from "@/types/study";
import { mockStudies } from "@/lib/mock-studies";

// 🧪 가짜 데이터가 6개뿐이라 쪽 번호가 보이도록 4개씩 (API가 오면 size=10)
const PAGE_SIZE = 4;

const categories: StudyCategory[] = [
  "FRONTEND",
  "BACKEND",
  "ALGORITHM",
  "CS",
  "INTERVIEW",
];

// 스터디 목록 가져오기 — 목록 #5 · 검색/분야/정렬/쪽 번호 #9
// 🧪 지금은 가짜 데이터에서 "API가 해 줄 일"(찾기 → 세기 → 정렬 → 쪽 나누기)을 흉내 내요.
//    API가 오면 이 함수 안쪽만 fetch(apiPaths.study.list + 조건)로 바꾸면 돼요.
export async function getStudies(
  query: StudyListQuery = {},
): Promise<ApiResponse<StudyListData>> {
  const { q = "", category, sort = "latest", page = 1 } = query;

  // 1) 검색어로 거르기 — 제목이나 기술 태그에 검색어가 들어 있는 것만
  const keyword = q.trim().toLowerCase();
  const searched = mockStudies.filter(
    (study) =>
      keyword === "" ||
      study.title.toLowerCase().includes(keyword) ||
      study.techTags.some((tag) => tag.toLowerCase().includes(keyword)),
  );

  // 2) 분야 칩 숫자 — 검색 결과를 분야별로 세기 (분야를 고르기 전 기준)
  const categoryCounts = { ALL: searched.length } as Record<
    StudyCategory | "ALL",
    number
  >;
  for (const item of categories) {
    categoryCounts[item] = searched.filter(
      (study) => study.category === item,
    ).length;
  }

  // 3) 분야로 거르기
  const filtered = category
    ? searched.filter((study) => study.category === category)
    : searched;

  // 4) 표 머리줄 숫자 — 쪽을 나누기 전에 세야 전체 개수가 돼요
  const openCount = filtered.filter((study) => study.status === "OPEN").length;
  const closedCount = filtered.length - openCount;

  // 5) 정렬 — 최신순(기본) / 오래된순
  const sorted = [...filtered].sort((a, b) =>
    sort === "oldest"
      ? a.createdAt.localeCompare(b.createdAt)
      : b.createdAt.localeCompare(a.createdAt),
  );

  // 6) 쪽 나누기 — 없는 쪽 번호(0 · 99)는 가장 가까운 쪽으로
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const studies = sorted.slice(start, start + PAGE_SIZE);

  return {
    success: true,
    code: 200,
    message: "",
    data: {
      studies,
      currentPage,
      totalPages,
      totalItems: sorted.length,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      openCount,
      closedCount,
      categoryCounts,
    },
  };
}

// 스터디 하나 찾기 (상세 화면 #6)
// 주소가 이상하거나(/studies/abc) 없는 번호면 null → 화면에서 404로 보여 줘요.
export async function findStudy(studyId: string): Promise<Study | null> {
  const id = Number(studyId);
  if (!Number.isInteger(id) || id <= 0) return null;

  // 🧪 API 연결 전: 가짜 데이터에서 찾기
  // API가 나오면 이 줄을 fetch(apiPaths.study.detail(id))로 바꿔요.
  return mockStudies.find((study) => study.studyId === id) ?? null;
}

// 내가 만든 스터디 — 내 모집글 #13 (화면 ⑦)
// 🧪 지금은 가짜 데이터에서 스터디장 이름으로 골라요. 최신순.
//    API가 오면 fetch(apiPaths.study.mine) + 로그인 토큰으로 바꿔요 (서버가 토큰으로 "나"를 알아요).
export async function getStudiesByAuthor(
  authorNickname: string,
): Promise<ApiResponse<StudySummary[]>> {
  const studies = mockStudies
    .filter((study) => study.authorNickname === authorNickname)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { success: true, code: 200, message: "", data: studies };
}
