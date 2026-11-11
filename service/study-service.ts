import { cache } from "react";
import { apiPaths } from "@/config/api-paths";
import { apiRequest } from "@/lib/api-client";
import { mockStudies } from "@/lib/mock-studies";
import type { ApiResponse } from "@/types/api-response";
import type {
  Study,
  StudyListData,
  StudyListQuery,
  StudySummary,
} from "@/types/study";

// 한 쪽에 보여 줄 개수 (#14 1번)
const PAGE_SIZE = 10;

// 스터디 목록 가져오기 — 목록 #5 · 검색/분야/정렬/쪽 번호 #9
// GET /api/v1/studies — 검색 · 분야 · 정렬 · 쪽 나누기 · 개수 세기는 서버가 해 줘요
// 주소의 page는 1부터, API의 page는 0부터라서 -1 해서 보내요.
export async function getStudies(
  query: StudyListQuery = {},
): Promise<ApiResponse<StudyListData | null>> {
  const { q = "", category, sort = "latest", page = 1 } = query;
  const request = (zeroBasedPage: number) =>
    apiRequest<StudyListData>(apiPaths.study.list, {
      query: {
        page: zeroBasedPage,
        size: PAGE_SIZE,
        q: q.trim() || undefined,
        category,
        sort,
      },
    });

  const result = await request(Math.max(1, page) - 1);

  // 없는 쪽 번호(?page=99)면 마지막 쪽을 다시 가져와요
  if (
    result.success &&
    result.data &&
    result.data.totalPages > 0 &&
    result.data.page >= result.data.totalPages
  ) {
    return request(result.data.totalPages - 1);
  }
  return result;
}

// 스터디 하나 (상세 화면 #6) — GET /api/v1/studies/{id}
// 주소가 이상하거나(/studies/abc) 없는 번호(404)면 null → 화면에서 notFound()
// 서버와 연결이 안 되는 등 다른 실패는 오류로 알려요 (없는 글로 착각하지 않게)
// cache(): 같은 요청 안에서 탭 제목(generateMetadata)과 본문이 두 번 불러도 한 번만 가져와요
export const findStudy = cache(
  async (studyId: string): Promise<Study | null> => {
    const id = Number(studyId);
    if (!Number.isInteger(id) || id <= 0) return null;

    const result = await apiRequest<Study>(apiPaths.study.detail(id));
    if (result.success && result.data) return result.data;
    if (result.status === 404) return null;
    throw new Error(result.message);
  },
);

// 내가 만든 스터디 — 내 모집글 #13 (화면 ⑦)
// 🧪 지금은 가짜 데이터에서 스터디장 이름으로 골라요. 최신순.
//    로그인(#4)이 붙으면 GET /api/v1/studies/me + 토큰으로 바꿔요 (서버가 토큰으로 "나"를 알아요).
export async function getStudiesByAuthor(
  authorName: string,
): Promise<ApiResponse<StudySummary[]>> {
  const studies = mockStudies
    .filter((study) => study.authorName === authorName)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { success: true, message: "", data: studies };
}
