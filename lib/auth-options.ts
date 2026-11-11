import "server-only";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiPaths } from "@/config/api-paths";
import { routes } from "@/config/routes";
import { apiRequest } from "@/lib/api-client";
import { loginSchema } from "@/schema/auth-schema";

// NextAuth v4 설정 — 로그인(#4) · 보안 체크리스트(#45 B)
// 강의(10/29 · 11/3): "토큰은 브라우저로 내리지 않는다 → Next 서버 쪽 세션에"
// - 강사님 토큰(access · refresh)은 jwt 콜백 안에만 → NEXTAUTH_SECRET으로 암호화된 httpOnly 쿠키
// - session 콜백(브라우저에서 /api/auth/session으로 보이는 곳)엔 이름 · 이메일 · userId만
// - 세션 시간 = 백엔드 토큰 시간: 토큰이 끝나면 다시 로그인 (강의 P3-10)

/** 백엔드가 expiresIn을 안 주면 쓸 기본값 (2시간, 강의 예시) */
const DEFAULT_EXPIRES_IN_SECONDS = 60 * 60 * 2;

/** 강사님 로그인 응답 data (스웨거 AuthResponse) */
type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 초
  tokenType: string;
  userId: number;
  email: string;
  name: string;
};

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
      // 🔒 화면 검사와 같은 규칙으로 서버에서 한 번 더 (#45 A4)
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const result = await apiRequest<AuthResponse>(apiPaths.auth.login, {
          method: "POST",
          body: parsed.data,
        });
        if (!result.success || !result.data?.accessToken) return null; // 실패 이유는 하나로

        const data = result.data;
        return {
          id: String(data.userId),
          name: data.name,
          email: data.email,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
        };
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
      if (token?.accessToken) {
        await apiRequest(apiPaths.auth.logout, {
          method: "POST",
          token: token.accessToken,
        });
      }
    },
  },
};
