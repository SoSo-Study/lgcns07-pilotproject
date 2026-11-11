import "server-only";
import { getServerAuth } from "@/lib/auth-session";

// 지금 로그인한 사람 정보 — 서버에서만 불러요 (액션 · 서비스 안에서)
// 로그인 안 했거나 세션 시간이 끝났으면 null
// 🔒 "내 것"은 이 함수로 서버가 정해요. 내 id를 주소 · 폼으로 받지 않아요 (#45 B7)

export type CurrentUser = {
  userId: number;
  nickname: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const auth = await getServerAuth();
  if (!auth) return null;
  return { userId: auth.userId, nickname: auth.name };
}
