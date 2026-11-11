import "next-auth";
import "next-auth/jwt";

// NextAuth 기본 모양에 우리 값 더하기
// 🔒 토큰은 JWT(서버 쪽 암호화 쿠키)에만 있고, Session(브라우저에서 보이는 곳)엔 없어요
declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }

  interface Session {
    user: {
      name: string | null;
      email: string | null;
      userId?: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}
