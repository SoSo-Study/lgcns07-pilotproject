import { signOut } from "next-auth/react";

// 🔌 로그아웃 연결 지점 — 화면(LogoutButton)은 이 함수만 불러요.
// signOut → 우리 사이트 로그인 쿠키 지우기
//         + 서버 events.signOut(lib/auth-options.ts)에서 강사님 POST /auth/logout (토큰 무효화)
// 화면 이동은 LogoutButton이 해요 (redirect: false)
export async function requestLogout(): Promise<void> {
  await signOut({ redirect: false });
}
