import { apiPaths } from "@/config/api-paths";
import { apiRequest } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api-response";
import type {
  Application,
  ApplicationStatus,
  MyApplication,
  PageData,
} from "@/types/study";

// 신청(application) API를 부르는 곳 — 로그인 토큰이 꼭 필요해요
// 스터디장만 볼 수 있는지 · 이미 처리됐는지 · 자리가 다 찼는지는 강사님 서버가 막아 줘요 (403 · 409)

// 스터디 하나에 들어온 신청 목록 — GET /api/v1/studies/{id}/applications (스터디장만)
export async function getApplicationsByStudy(
  token: string,
  studyId: number,
): Promise<ApiResponse<Application[] | null>> {
  return apiRequest<Application[]>(apiPaths.application.listByStudy(studyId), {
    token,
  });
}

// 신청 하나를 승인 또는 거절 — PATCH /api/v1/applications/{id} { status }
export async function decideApplication(
  token: string,
  applicationId: number,
  decision: Exclude<ApplicationStatus, "PENDING">,
): Promise<ApiResponse<Application | null>> {
  return apiRequest<Application>(apiPaths.application.decide(applicationId), {
    method: "PATCH",
    token,
    body: { status: decision },
  });
}

// 내가 신청한 스터디 — GET /api/v1/applications/me (⑧ 프로필, #14 14번)
// "나"는 토큰으로 — 내 id를 보내지 않아요
export async function getMyApplications(
  token: string,
  page = 1,
  size = 50,
): Promise<ApiResponse<PageData<MyApplication> | null>> {
  return apiRequest<PageData<MyApplication>>(apiPaths.application.mine, {
    token,
    query: { page: Math.max(1, page) - 1, size },
  });
}

// 내 신청 취소 — DELETE /api/v1/studies/{studyId}/applications/me (#14 7번)
// 승인된 뒤 취소하면 서버가 인원 -1, 마감일 전이면 다시 모집 중으로 바꿔요
export async function cancelMyApplication(
  token: string,
  studyId: number,
): Promise<ApiResponse<null>> {
  const result = await apiRequest(apiPaths.application.cancel(studyId), {
    method: "DELETE",
    token,
  });
  return { ...result, data: null };
}
