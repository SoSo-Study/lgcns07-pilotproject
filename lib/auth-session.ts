import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "@/lib/env";

// 서버(액션 · 서비스)에서만 로그인 정보를 꺼내는 곳
// 🔒 토큰은 여기서 꺼내 api-client로만 넘겨요. 화면(props) · 로그 · 응답으로 보내지 않아요

type ServerAuth = {
  userId: number;
  name: string;
  email: string;
  accessToken: string;
};

// 암호화된 세션 쿠키를 서버에서 풀어 읽어요 (브라우저는 못 읽어요)
// 토큰 시간이 끝났으면 로그인 안 한 것으로 봐요 → 다시 로그인 (강의: 세션 시간 = 토큰 시간)
export async function getServerAuth(): Promise<ServerAuth | null> {
  // "요청이 왔을 때만 실행" 표시 — 아래 getToken · Date.now()가 "지금 시간"을 쓰는데,
  // cacheComponents가 화면을 미리 그리다 시간 값을 만나면 오류를 내요 (상세 화면 D-day와 같은 방법)
  await connection();
  const cookieStore = await cookies();
  const token = await getToken({
    req: {
      cookies: Object.fromEntries(
        cookieStore.getAll().map((cookie) => [cookie.name, cookie.value]),
      ),
      headers: {},
    } as unknown as Parameters<typeof getToken>[0]["req"],
    secret: env.nextAuthSecret,
  });

  if (!token?.accessToken || !token.userId) return null;
  if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires) {
    return null;
  }

  return {
    userId: token.userId,
    name: token.name ?? "",
    email: token.email ?? "",
    accessToken: token.accessToken,
  };
}

/** 로그인이 필요한 API에 붙일 토큰 (없으면 null) */
export async function getAccessToken(): Promise<string | null> {
  return (await getServerAuth())?.accessToken ?? null;
}
