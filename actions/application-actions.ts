"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";
import { getCurrentUser } from "@/lib/current-user";
import { decideApplicationSchema } from "@/schema/application-schema";
import {
  decideApplication,
  findApplication,
  getApplicationsByStudy,
} from "@/service/application-service";
import { findStudy } from "@/service/study-service";

// 🔒 이 스터디의 스터디장이 "나"인지 확인 (#4 본문: "내 것"은 서버가 로그인 정보로 정해요)
// 괜찮으면 null, 아니면 화면에 보여 줄 문구를 돌려줘요.
// (export 안 한 도우미 함수라 화면에서 직접 부를 수 없어요)
async function checkStudyOwner(studyId: number): Promise<string | null> {
  const me = await getCurrentUser();
  if (!me) return "로그인이 필요해요.";

  const study = await findStudy(String(studyId));
  if (!study) return "스터디를 찾을 수 없어요.";
  if (study.authorNickname !== me.nickname) {
    return "스터디장만 신청자를 관리할 수 있어요.";
  }
  return null;
}

// 스터디 하나에 들어온 신청 목록 불러오기 (화면 → 여기 → service)
// 스터디장만 볼 수 있어요 (다른 사람이 주소로 들어와도 막기)
export async function getApplicationsAction(studyId: number) {
  const ownerError = await checkStudyOwner(studyId);
  if (ownerError) {
    return { success: false, code: 403, message: ownerError, data: [] };
  }
  return getApplicationsByStudy(studyId);
}

// 승인 · 거절 결과를 화면에 돌려주는 모양
// 성공이면 null(화면이 다시 그려지니까 따로 알릴 게 없어요), 실패면 보여 줄 문구
export type DecideState = { message: string } | null;

// [승인] · [거절] 버튼을 누르면 서버에서 실행되는 함수
// 흐름: 화면(폼) → 여기(검사) → service(요청) → 강사님 API
// useActionState로 부르기 때문에 첫 번째 값은 "직전 결과"(여기선 안 써요)
export async function decideApplicationAction(
  _prevState: DecideState,
  formData: FormData,
): Promise<DecideState> {
  // 1. 폼에서 온 값 검사 (화면을 거치지 않고 직접 요청할 수도 있어서 서버에서 꼭 다시 검사)
  const parsed = decideApplicationSchema.safeParse({
    applicationId: formData.get("applicationId"),
    decision: formData.get("decision"),
  });

  if (!parsed.success) {
    return { message: "잘못된 요청이에요. 새로고침 후 다시 시도해 주세요." };
  }

  // 2. 🔒 이 신청이 들어온 스터디의 스터디장인지 확인
  const application = await findApplication(parsed.data.applicationId);
  if (!application) {
    return { message: "신청을 찾을 수 없어요." };
  }
  const ownerError = await checkStudyOwner(application.studyId);
  if (ownerError) {
    return { message: ownerError };
  }

  // 3. service에 처리 요청
  const result = await decideApplication(
    parsed.data.applicationId,
    parsed.data.decision,
  );

  // 4. 실패하면 서버가 준 문구를 그대로 화면에 (예: "이미 처리된 신청이에요.")
  if (!result.success) {
    return { message: result.message };
  }

  // 5. 성공하면 화면을 최신 상태로 다시 그리기 (숫자 카드 · 표가 같이 바뀌어요)
  revalidatePath(routes.applicants);
  return null;
}
