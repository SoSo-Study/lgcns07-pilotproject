import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { guestOnlyPaths, protectedPaths } from "@/config/auth-paths";
import { routes } from "@/config/routes";

// 로그인 문지기 — 페이지가 열리기 "전에" 검사해요 (강의 11/4, Next 16 이름: proxy) · #45 B5
// 🔒 proxy는 1차 문지기일 뿐 — 서버 액션 · 서비스에서도 다시 확인해요 (#45 B6)

const startsWith = (pathname: string, base: string) =>
  pathname === base || pathname.startsWith(`${base}/`);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({ req: request });

  // "쿠키가 있다 ≠ 로그인" — 토큰 안에 강사님 토큰이 있고, 시간이 남아 있어야 로그인
  const isLoggedIn =
    Boolean(token?.accessToken) &&
    (!token?.accessTokenExpires || Date.now() < token.accessTokenExpires);

  // 1) 로그인이 필요한 주소인데 로그인 안 했으면 → 로그인 화면 (원래 가려던 주소를 들고)
  if (
    !isLoggedIn &&
    protectedPaths.some((base) => startsWith(pathname, base))
  ) {
    const loginUrl = new URL(routes.login, request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // 2) 이미 로그인했는데 로그인 · 가입 화면으로 오면 → 목록
  if (isLoggedIn && guestOnlyPaths.some((base) => startsWith(pathname, base))) {
    return NextResponse.redirect(new URL(routes.studies, request.url));
  }

  return NextResponse.next();
}

// 문지기가 볼 주소만 (이미지 · 정적 파일 · /api는 건너뛰어요)
export const config = {
  matcher: [
    "/my-studies/:path*",
    "/studies/write/:path*",
    "/applicants/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};
