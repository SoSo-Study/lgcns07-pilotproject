import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { EMAIL_CODE_TTL_SECONDS } from "@/service/auth-service";

// "이 이메일은 방금 인증을 마쳤어요" 표시 (#45 C3)
// 화면에서만 "인증해야 가입 버튼이 열림"으로 막으면, 서버 액션을 직접 불러 인증을 건너뛸 수 있어요.
// → 인증에 성공하면 서버가 서명한 httpOnly 쿠키를 남기고, 가입 액션이 그 쿠키를 확인해요.
// - 값 = 이메일의 서명(HMAC) — 이메일 자체는 쿠키에 안 넣어요
// - httpOnly(화면 코드가 못 읽음) · sameSite lax · 배포에선 secure · 10분
const COOKIE_NAME = "soso-email-verified";

function sign(email: string) {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("환경 변수 NEXTAUTH_SECRET이(가) 없어요.");
  return createHmac("sha256", secret)
    .update(`email-verified:${email.toLowerCase()}`)
    .digest("base64url");
}

export async function markEmailVerified(email: string) {
  (await cookies()).set(COOKIE_NAME, sign(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: EMAIL_CODE_TTL_SECONDS,
  });
}

export async function isEmailVerified(email: string) {
  const saved = (await cookies()).get(COOKIE_NAME)?.value;
  if (!saved) return false;
  const expected = Buffer.from(sign(email));
  const actual = Buffer.from(saved);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export async function clearEmailVerified() {
  (await cookies()).delete(COOKIE_NAME);
}
