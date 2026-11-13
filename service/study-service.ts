import { cache } from "react";
import { apiPaths } from "@/config/api-paths";
import { apiRequest, type ApiResult } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api-response";
import type {
  BookmarkResult,
  PageData,
  Study,
  StudyListData,
  StudyComment,
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
  async (studyId: string, token?: string | null): Promise<Study | null> => {
    // 글 번호는 숫자 글자로만 (/studies/1%20 · /studies/1.0 · /studies/+1은 없는 글)
    // 자바스크립트가 정확히 다룰 수 있는 크기까지만 (/studies/999…9 → 1e+30으로 바뀌어 API가 거절, #96)
    if (!/^\d+$/.test(studyId)) return null;
    const id = Number(studyId);
    if (!Number.isSafeInteger(id) || id <= 0) return null;

    // 로그인했으면 액션이 토큰을 넘겨줘요 → "내 신청 상태" · "찜했는지"가 내 기준으로 와요
    // (서비스는 쿠키를 직접 읽지 않아요 — 강의 P1-08 "쿠키 · 이동은 액션")
    const result = await apiRequest<Study>(apiPaths.study.detail(id), {
      token,
    });
    if (result.success && result.data) return result.data;
    if (result.status === 404) return null;
    throw new Error(result.message);
  },
);

// 내가 만든 스터디 — 내 모집글 #13 (⑦) · 신청자 관리 스터디 고르기 (④)
// GET /api/v1/studies/me — "나"는 서버가 토큰으로 알아요 (내 id를 보내지 않아요)
export async function getMyStudies(
  token: string,
  page = 1,
  size = 50,
): Promise<ApiResponse<PageData<StudySummary> | null>> {
  return apiRequest<PageData<StudySummary>>(apiPaths.study.mine, {
    token,
    query: { page: Math.max(1, page) - 1, size },
  });
}

// 보내는 값 (CreateStudyRequest · UpdateStudyRequest) — 코드 값 · 숫자, 이름은 받을 때와 같게
type StudyInput = Pick<
  Study,
  | "title"
  | "category"
  | "techTags"
  | "maxMembers"
  | "deadline"
  | "mode"
  | "content"
>;

// ③ 등록 — POST /api/v1/studies (작성자는 서버가 토큰으로)
export async function createStudy(
  token: string,
  input: StudyInput,
): Promise<ApiResponse<Study | null>> {
  return apiRequest<Study>(apiPaths.study.create, {
    method: "POST",
    token,
    body: input,
  });
}

// ③ 수정 — PUT /api/v1/studies/{id} (스터디장만, 정원은 현재 인원보다 작게 못 바꿈 — 서버 규칙)
export async function updateStudy(
  token: string,
  studyId: number,
  input: StudyInput,
): Promise<ApiResponse<Study | null>> {
  return apiRequest<Study>(apiPaths.study.update(studyId), {
    method: "PUT",
    token,
    body: input,
  });
}

// ② 삭제 — DELETE /api/v1/studies/{id} (스터디장만)
export async function deleteStudy(
  token: string,
  studyId: number,
): Promise<ApiResponse<null>> {
  const result = await apiRequest(apiPaths.study.remove(studyId), {
    method: "DELETE",
    token,
  });
  return { ...result, data: null };
}

// ② 댓글 목록 — GET /api/v1/studies/{id}/comments (누구나, 오래된 순)
export async function getStudyComments(
  studyId: number,
): Promise<ApiResponse<StudyComment[] | null>> {
  return apiRequest<StudyComment[]>(apiPaths.study.comments(studyId));
}

// ② 댓글 쓰기 — POST /api/v1/studies/{id}/comments { content } (회원, 작성자는 서버가 토큰으로)
export async function createStudyComment(
  token: string,
  studyId: number,
  content: string,
): Promise<ApiResponse<StudyComment | null>> {
  return apiRequest<StudyComment>(apiPaths.study.comments(studyId), {
    method: "POST",
    token,
    body: { content },
  });
}

// ② 댓글 삭제 — DELETE /api/v1/studies/{id}/comments/{commentId} (작성자만, #111)
// ⚠ 11/13 기준 강사님 API에 아직 없는 주소예요. status를 같이 돌려줘서 액션이 "아직 없음"을 구분해요
export async function deleteStudyComment(
  token: string,
  studyId: number,
  commentId: number,
): Promise<ApiResult<null>> {
  const result = await apiRequest(apiPaths.study.comment(studyId, commentId), {
    method: "DELETE",
    token,
  });
  return { ...result, data: null };
}

// ② 찜 — POST /api/v1/studies/{id}/bookmarks (회원, 누를 때마다 켜짐 · 꺼짐)
export async function toggleStudyBookmark(
  token: string,
  studyId: number,
): Promise<ApiResponse<BookmarkResult | null>> {
  return apiRequest<BookmarkResult>(apiPaths.study.bookmarks(studyId), {
    method: "POST",
    token,
  });
}
