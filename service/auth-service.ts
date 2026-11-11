import { apiPaths } from "@/config/api-paths";
import { apiRequest } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api-response";

// 회원가입 · 이메일 인증 API를 부르는 곳 (강사님 테스트 서버 /api/v1/auth/…) — #3
// 함수 이름 · 돌려주는 모양은 그대로라 화면 · 액션 코드는 안 바뀌어요.

/** 인증번호 유효 시간 (강사님 API 기본값 10분) */
export const EMAIL_CODE_TTL_SECONDS = 600;

// 이메일로 6자리 인증번호 보내기 — POST /auth/email/send-code
// 이미 가입된 이메일이면 서버가 409 → 이 요청 하나가 "중복 확인"도 겸해요
// demoCode: 메일 서버가 없는 테스트 서버에서만 와요 (화면에 "시연용"으로만)
export async function sendEmailCode(
  email: string,
): Promise<ApiResponse<{ demoCode?: string } | null>> {
  return apiRequest<{ demoCode?: string }>(apiPaths.auth.sendCode, {
    method: "POST",
    body: { email },
  });
}

// 인증번호 확인 — POST /auth/email/verify-code (1회용 · 틀리거나 만료면 400)
export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<ApiResponse<{ verified: boolean } | null>> {
  const result = await apiRequest<{ verified: boolean; message?: string }>(
    apiPaths.auth.verifyCode,
    { method: "POST", body: { email, code } },
  );
  // 서버가 success: true여도 verified가 false면 실패로 봐요
  if (result.success && !result.data?.verified) {
    return { ...result, success: false };
  }
  return result;
}

// 회원가입 — POST /auth/register  { email, name, password }
// (응답에 토큰이 오지만 쓰지 않아요 — 가입 뒤 로그인 화면에서 NextAuth로 로그인해요)
export async function registerUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<ApiResponse<null>> {
  const result = await apiRequest(apiPaths.auth.signup, {
    method: "POST",
    body: input,
  });
  return {
    success: result.success,
    message: result.message,
    code: result.code,
    data: null,
  };
}

/** 내 정보 — GET /auth/me 응답 중 화면에 쓰는 것만 (토큰 값은 안 꺼내요) */
export type MyAccount = {
  userId: number;
  email: string;
  name: string;
  role?: string;
  statusMessage?: string | null;
};

// 내 정보 — GET /api/v1/auth/me (⑧ 프로필)
export async function getMyAccount(
  token: string,
): Promise<ApiResponse<MyAccount | null>> {
  const result = await apiRequest<MyAccount & Record<string, unknown>>(
    apiPaths.auth.me,
    { token },
  );
  if (!result.success || !result.data) return { ...result, data: null };
  // 🔒 응답에 토큰이 같이 와도 화면으로 넘기지 않게 필요한 값만 골라요 (#45 · 강의 11/9)
  const { userId, email, name, role, statusMessage } = result.data;
  return { ...result, data: { userId, email, name, role, statusMessage } };
}

// 비밀번호 바꾸기 — POST /api/v1/users/me/password { currentPassword, newPassword }
export async function changeMyPassword(
  token: string,
  input: { currentPassword: string; newPassword: string },
): Promise<ApiResponse<null>> {
  const result = await apiRequest(apiPaths.auth.changePassword, {
    method: "POST",
    token,
    body: input,
  });
  return { ...result, data: null };
}
