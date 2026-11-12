import "server-only";
import {
  attemptKey,
  clearFailures,
  lockedFor,
  recordFailure,
} from "@/lib/login-attempts";
import { loginSchema } from "@/schema/auth-schema";
import { loginWithPassword, logoutSession } from "@/service/auth-service";
import type { User } from "next-auth";

// 로그인 · 로그아웃의 "액션 층" — NextAuth 설정(lib/auth-options.ts)은 여기만 부르고 결과만 받아요
// 강의 11/9 최종 코드: authorize → actions/authActions의 loginWithCredentials → 서비스 (P1-06 · P1-11)
//
// 🔒 왜 "use server"가 아닌가요?
//   "use server" 파일의 함수는 브라우저에서도 부를 수 있는 주소가 생겨요.
//   이 함수는 토큰을 돌려주니까, 서버(NextAuth) 안에서만 부르게 "server-only"로 막아요.

export type CredentialsLoginResult =
  { ok: true; user: User } | { ok: false; locked: boolean };

// 검사 → 잠금 확인(#53) → 로그인 서비스 → 성공 · 실패 기록
export async function loginWithCredentials(
  credentials: unknown,
  ip: string,
): Promise<CredentialsLoginResult> {
  // 🔒 화면 검사와 같은 규칙으로 서버에서 한 번 더 (#45 A4)
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) return { ok: false, locked: false };

  // 🔒 10분 안에 5번 틀리면 5분 잠금 — 잠겼으면 강사님 API를 부르지도 않아요 (#53)
  const key = attemptKey(ip, parsed.data.email);
  if (lockedFor(key) > 0) return { ok: false, locked: true };

  const result = await loginWithPassword(parsed.data);
  if (!result.success || !result.data?.accessToken) {
    // 서버가 "틀렸다"고 답한 경우만 세요 (연결 실패 · 서버 오류는 안 셈)
    if (result.status >= 400 && result.status < 500) recordFailure(key);
    return { ok: false, locked: lockedFor(key) > 0 };
  }

  clearFailures(key); // 성공하면 틀린 횟수를 처음부터
  const data = result.data;
  return {
    ok: true,
    user: {
      id: String(data.userId),
      name: data.name,
      email: data.email,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn,
    },
  };
}

// 로그아웃 때 강사님 서버에서도 토큰 무효화 (쿠키만 지우면 훔친 토큰은 계속 쓸 수 있어요)
export async function logoutOnServer(accessToken: string | undefined) {
  if (accessToken) await logoutSession(accessToken);
}
