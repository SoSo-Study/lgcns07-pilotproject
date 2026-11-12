import "server-only";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LOGIN_LOCKED_CODE } from "@/config/login-limit";
import { routes } from "@/config/routes";
import { loginWithCredentials, logoutOnServer } from "@/actions/auth-login";

/** 요청한 사람의 IP (Vercel · 프록시 뒤에서는 x-forwarded-for의 첫 번째 값) */
function clientIp(headers: Record<string, unknown> | undefined) {
  const forwarded = headers?.["x-forwarded-for"];
  const first = typeof forwarded === "string" ? forwarded.split(",")[0] : "";
  const realIp = headers?.["x-real-ip"];
  return (
    first.trim() || (typeof realIp === "string" ? realIp : "") || "unknown"
  );
}

// NextAuth v4 설정 — 로그인(#4) · 보안 체크리스트(#45 B)
// 강의(10/29 · 11/3): "토큰은 브라우저로 내리지 않는다 → Next 서버 쪽 세션에"
// - 강사님 토큰(access · refresh)은 jwt 콜백 안에만 → NEXTAUTH_SECRET으로 암호화된 httpOnly 쿠키
// - session 콜백(브라우저에서 /api/auth/session으로 보이는 곳)엔 이름 · 이메일 · userId만
// - 세션 시간 = 백엔드 토큰 시간: 토큰이 끝나면 다시 로그인 (강의 P3-10)

/** 백엔드가 expiresIn을 안 주면 쓸 기본값 (2시간, 강의 예시) */
const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60 * 2;

export const authOptions: NextAuthOptions = {
  pages: { signIn: routes.login }, // NextAuth 기본 화면 대신 우리 ⑤ 로그인 화면
  session: { strategy: "jwt", maxAge: DEFAULT_EXPIRES_IN_SECONDS },
  providers: [
    CredentialsProvider({
      name: "이메일",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      // 설정에는 분기를 늘어놓지 않고, 액션 층에 맡겨 결과만 받아요 (강의 P1-11)
      async authorize(credentials, req) {
        const result = await loginWithCredentials(
          credentials,
          clientIp(req?.headers),
        );
        if (result.ok) return result.user;
        if (result.locked) throw new Error(LOGIN_LOCKED_CODE); // 화면이 잠금 문구로 바꿔요
        return null; // 실패 이유는 하나로
      },
    }),
  ],
  callbacks: {
    // 서버 안쪽 저장소(암호화 쿠키) — 여기에만 토큰을 둬요
    async jwt({ token, user }) {
      if (user) {
        const expiresIn = user.expiresIn || DEFAULT_EXPIRES_IN_SECONDS;
        token.userId = Number(user.id);
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + expiresIn * 1000;
      }
      return token;
    },
    // 브라우저로 나가는 정보 — 토큰은 절대 넣지 않아요 (#45 B2)
    async session({ session, token }) {
      session.user = {
        name: token.name ?? null,
        email: token.email ?? null,
        userId: token.userId,
      };
      return session;
    },
  },
  events: {
    // 로그아웃 = 쿠키 지우기 + 강사님 서버에서도 토큰 무효화 (#45 B4)
    // 쿠키만 지우면 훔친 토큰은 만료 전까지 계속 쓸 수 있어요
    async signOut({ token }) {
      await logoutOnServer(token?.accessToken);
    },
  },
};
