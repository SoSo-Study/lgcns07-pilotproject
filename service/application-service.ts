import { mockApplications } from "@/lib/mock-applications";
import { mockStudies } from "@/lib/mock-studies";
import type { ApiResponse } from "@/types/api-response";
import type { Application, ApplicationStatus } from "@/types/study";

// 신청(application) API를 부르는 곳
// 🧪 지금은 강사님 API가 없어서, 서버 메모리에 가짜 데이터를 두고 흉내만 내요.
//    (서버를 껐다 켜면 처음 상태로 돌아가요)
//    API가 나오면 아래 함수 안쪽만 fetch로 바꾸면 돼요. 함수 이름 · 돌려주는 모양은 그대로!
//    주소는 config/api-paths.ts의 apiPaths.application.listByStudy / decide
const applications: Application[] = mockApplications.map((application) => ({
  ...application,
}));

// 스터디 하나에 들어온 신청 목록
export async function getApplicationsByStudy(
  studyId: number,
): Promise<ApiResponse<Application[]>> {
  return {
    success: true,
    code: 200,
    message: "신청 목록을 불러왔어요.",
    data: applications.filter((application) => application.studyId === studyId),
  };
}
// 신청 하나 찾기 (승인 · 거절 전에 "어느 스터디의 신청인지" 확인할 때)
// 없으면 null
export async function findApplication(
  applicationId: number,
): Promise<Application | null> {
  return (
    applications.find((item) => item.applicationId === applicationId) ?? null
  );
}
// 신청 하나를 승인 또는 거절
export async function decideApplication(
  applicationId: number,
  decision: Exclude<ApplicationStatus, "PENDING">,
): Promise<ApiResponse<Application | null>> {
  const application = applications.find(
    (item) => item.applicationId === applicationId,
  );

  if (!application) {
    return {
      success: false,
      code: 404,
      message: "신청을 찾을 수 없어요.",
      data: null,
    };
  }

  if (application.status !== "PENDING") {
    return {
      success: false,
      code: 409,
      message: "이미 처리된 신청이에요.",
      data: null,
    };
  }

  // 🧪 서버 규칙 흉내: 자리가 다 찬 스터디는 승인 막기 (거절은 가능)
  const study = mockStudies.find(
    (item) => item.studyId === application.studyId,
  );
  if (
    decision === "APPROVED" &&
    study &&
    study.currentMembers >= study.maxMembers
  ) {
    return {
      success: false,
      code: 409,
      message: "모집 인원이 다 찼어요.",
      data: null,
    };
  }

  application.status = decision;

  return {
    success: true,
    code: 200,
    message: decision === "APPROVED" ? "승인했어요." : "거절했어요.",
    data: application,
  };
}
