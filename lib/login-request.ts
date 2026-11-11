import { signIn } from "next-auth/react";
import type { LoginValues } from "@/schema/auth-schema";

// 🔌 로그인 연결 지점 — 화면(LoginForm)은 이 함수만 불러요.
// NextAuth v4 signIn → 서버의 authorize(lib/auth-options.ts)가 강사님 POST /auth/login을 불러요
// 🔒 토큰은 서버 쪽 암호화 쿠키에만 남고, 이 함수(브라우저)로는 돌아오지 않아요

/** 실패 문구는 하나로 — "없는 이메일"과 "틀린 비밀번호"를 나눠 말하지 않아요 */
export const LOGIN_FAILED_MESSAGE = "이메일 또는 비밀번호가 맞지 않아요.";

export type LoginResult = { ok: true } | { ok: false; message: string };

export async function requestLogin(values: LoginValues): Promise<LoginResult> {
  const response = await signIn("credentials", { ...values, redirect: false });
  return response?.ok && !response.error
    ? { ok: true }
    : { ok: false, message: LOGIN_FAILED_MESSAGE };
}
