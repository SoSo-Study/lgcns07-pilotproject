import "server-only";
import { createHmac, hkdfSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { EMAIL_CODE_TTL_SECONDS } from "@/service/auth-service";

// "이 이메일은 방금 인증을 마쳤어요" 표시 (#45 C3)
// 화면에서만 "인증해야 가입 버튼이 열림"으로 막으면, 서버 액션을 직접 불러 인증을 건너뛸 수 있어요.
// → 인증에 성공하면 서버가 서명한 httpOnly 쿠키를 남기고, 가입 액션이 그 쿠키를 확인해요.
// - 값 = 이메일의 서명(HMAC) — 이메일 자체는 쿠키에 안 넣어요
// - httpOnly(화면 코드가 못 읽음) · sameSite lax · 배포에선 secure · 10분
const COOKIE_NAME = "soso-email-verified";

// 🔒 키 나누기: 로그인 쿠키를 암호화하는 NEXTAUTH_SECRET을 그대로 쓰지 않고,
// 그 값에서 "이메일 인증 전용 키"를 따로 뽑아 써요(HKDF). 한 키가 여러 일을 하지 않게 (강의 S7 지적)
// 새 환경 변수를 만들지 않아도 돼서 팀원 · Vercel 설정은 그대로예요
function verifyKey() {
  return Buffer.from(
    hkdfSync("sha256", env.nextAuthSecret, "", "soso-email-verified", 32),
  );
}

function sign(email: string) {
  return createHmac("sha256", verifyKey())
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
