import type { LoginValues } from "@/schema/auth-schema";

// 🔌 로그인 연결 지점 — auth 담당이 이 함수 안쪽만 바꾸면 돼요.
//    화면(LoginForm)은 이 함수만 불러요. 돌려주는 모양(LoginResult)은 그대로 두세요.
//
// 🧪 지금: 가짜 로그인 (test@soso.study / password1234 만 성공)
// ✅ 나중 (NextAuth v4):
//    import { signIn } from "next-auth/react";
//    const res = await signIn("credentials", { ...values, redirect: false });
//    return res?.ok ? { ok: true } : { ok: false, message: LOGIN_FAILED_MESSAGE };

/** 실패 문구는 하나로 — "없는 이메일"과 "틀린 비밀번호"를 나눠 말하지 않아요 */
export const LOGIN_FAILED_MESSAGE = "이메일 또는 비밀번호가 맞지 않아요.";

export type LoginResult = { ok: true } | { ok: false; message: string };

export async function requestLogin(values: LoginValues): Promise<LoginResult> {
  await new Promise((resolve) => setTimeout(resolve, 600)); // 🧪 서버 다녀오는 시간 흉내

  const ok =
    values.email === "test@soso.study" && values.password === "password1234";
  return ok ? { ok: true } : { ok: false, message: LOGIN_FAILED_MESSAGE };
}
