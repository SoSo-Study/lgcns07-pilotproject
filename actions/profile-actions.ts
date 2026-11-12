"use server";

import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";
import { getServerAuth } from "@/lib/auth-session";
import { fieldErrors } from "@/lib/field-errors";
import {
  cancelApplicationSchema,
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/schema/profile-schema";
import {
  cancelMyApplication,
  getMyApplications,
} from "@/service/application-service";
import { changeMyPassword, getMyAccount } from "@/service/auth-service";
import { getMyStudies } from "@/service/study-service";

// ⑧ 내 프로필 (#42) — 화면 → 여기 → service → 강사님 API
// 🔒 "나"는 모두 서버가 토큰으로 정해요. 주소 · 폼으로 내 id를 받지 않아요 (#45 B7)

const LOGIN_REQUIRED = "로그인이 필요해요.";

// 프로필 화면 한 번에 필요한 것: 내 정보 · 내가 신청한 스터디 · 내 모집글
export async function loadProfile() {
  const auth = await getServerAuth();
  if (!auth) return { ok: false as const, message: LOGIN_REQUIRED };

  const [account, applications, studies] = await Promise.all([
    getMyAccount(auth.accessToken),
    getMyApplications(auth.accessToken),
    getMyStudies(auth.accessToken),
  ]);

  return {
    ok: true as const,
    // 내 정보 API가 실패해도 세션의 이름 · 이메일로 보여 줘요
    account: account.data ?? {
      userId: auth.userId,
      email: auth.email,
      name: auth.name,
    },
    applications,
    studies,
  };
}

// ── 신청 취소 ──
export type CancelState = { message: string } | null;

export async function cancelApplicationAction(
  _prev: CancelState,
  formData: FormData,
): Promise<CancelState> {
  const parsed = cancelApplicationSchema.safeParse({
    studyId: formData.get("studyId"),
  });
  if (!parsed.success) {
    return { message: "잘못된 요청이에요. 새로고침 후 다시 시도해 주세요." };
  }

  const auth = await getServerAuth();
  if (!auth) return { message: LOGIN_REQUIRED };

  // 내 신청인지 · 취소할 수 있는 상태인지는 서버가 토큰으로 확인해요
  const result = await cancelMyApplication(
    auth.accessToken,
    parsed.data.studyId,
  );
  if (!result.success) return { message: result.message };

  revalidatePath(routes.profile);
  return null;
}

// ── 비밀번호 바꾸기 ──
export type ChangePasswordState = {
  ok?: boolean;
  errors?: Partial<Record<keyof ChangePasswordValues, string>>;
  formError?: string;
};

export async function changePasswordAction(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  // 🔒 화면과 같은 규칙으로 서버에서 다시 검사 (#45 A4) — 비밀번호는 돌려주지 않아요
  const parsed = changePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    newPasswordConfirm: String(formData.get("newPasswordConfirm") ?? ""),
  });
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const auth = await getServerAuth();
  if (!auth) return { formError: LOGIN_REQUIRED };

  const result = await changeMyPassword(auth.accessToken, {
    currentPassword: parsed.data.currentPassword,
    newPassword: parsed.data.newPassword,
  });
  if (!result.success) {
    return { formError: result.message || "비밀번호를 바꾸지 못했어요." };
  }
  return { ok: true }; // 화면이 로그아웃 → 로그인 화면("새 비밀번호로 로그인해 주세요")
}
