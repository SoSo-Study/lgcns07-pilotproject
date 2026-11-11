import type { ApiResponse } from "@/types/api-response";

// 회원가입 · 이메일 인증 API를 부르는 곳 (강사님 테스트 서버 /api/v1/auth/…)
// 🧪 지금은 서버 메모리에 가짜 데이터를 두고 흉내만 내요. (서버를 껐다 켜면 처음 상태)
//    API로 바꿀 때는 아래 함수 안쪽만 fetch로 바꾸면 돼요. 함수 이름 · 돌려주는 모양은 그대로!
//    주소는 config/api-paths.ts에 추가해서 써요.

/** 인증번호 유효 시간 (강사님 API 기본값 10분) */
export const EMAIL_CODE_TTL_SECONDS = 600;

const registeredEmails = new Set(["test@soso.study", "front_park@soso.study"]);
const emailCodes = new Map<string, { code: string; expiresAt: number }>();

// 이메일로 6자리 인증번호 보내기 — POST /auth/email/send-code
// 이미 가입된 이메일이면 409 → 이 요청 하나가 "중복 확인"도 겸해요
export async function sendEmailCode(
  email: string,
): Promise<ApiResponse<{ demoCode?: string } | null>> {
  if (registeredEmails.has(email)) {
    return {
      success: false,
      code: "CONFLICT",
      message: "이미 가입된 이메일이에요.",
      data: null,
    };
  }

  // 다시 보내면 이전 번호는 버리고 새 번호 (API와 같은 규칙)
  const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  emailCodes.set(email, {
    code,
    expiresAt: Date.now() + EMAIL_CODE_TTL_SECONDS * 1000,
  });

  return {
    success: true,
    message: "입력하신 이메일로 인증번호를 보냈어요.",
    // 🧪 강사님 테스트 서버도 메일 서버가 없으면 demoCode로 번호를 알려 줘요
    data: { demoCode: code },
  };
}

// 인증번호 확인 — POST /auth/email/verify-code (1회용)
export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<ApiResponse<{ verified: boolean } | null>> {
  const saved = emailCodes.get(email);
  if (!saved || saved.code !== code || saved.expiresAt < Date.now()) {
    return {
      success: false,
      code: "BAD_REQUEST",
      message: "인증번호가 맞지 않거나 만료됐어요.",
      data: null,
    };
  }

  emailCodes.delete(email); // 한 번 쓰면 끝
  return {
    success: true,
    message: "이메일 인증을 마쳤어요.",
    data: { verified: true },
  };
}

// 회원가입 — POST /auth/register  { email, name, password }
export async function registerUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<ApiResponse<null>> {
  if (registeredEmails.has(input.email)) {
    return {
      success: false,
      code: "CONFLICT",
      message: "이미 가입된 이메일이에요.",
      data: null,
    };
  }

  registeredEmails.add(input.email);
  return { success: true, message: "가입했어요.", data: null };
}
