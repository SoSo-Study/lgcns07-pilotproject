// 로그인 · 내 정보 응답 모양 (강사님 스웨거 AuthResponse) — 타입은 types/에 모아요

/** POST /auth/login · /auth/register 응답 data */
export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // 초
  tokenType: string;
  userId: number;
  email: string;
  name: string;
};

/** GET /auth/me 중 화면에 쓰는 것만 (토큰 값은 안 꺼내요) */
export type MyAccount = {
  userId: number;
  email: string;
  name: string;
  role?: string;
  statusMessage?: string | null;
};
