import { routes } from "@/config/routes";

// 로그인 뒤 돌아갈 주소 검사: /login?callbackUrl=/studies/write
// 🔒 우리 사이트 안 주소만 허락해요.
//    ?callbackUrl=https://가짜사이트 를 그대로 따라가면, 진짜 로그인 화면을 거쳐
//    가짜 사이트로 보내는 피싱에 쓰일 수 있어요(오픈 리다이렉트).

const FALLBACK = routes.studies; // 이상하면 목록으로
const CHECK_ORIGIN = "http://soso.local"; // 비교용 가짜 주소 (실제로 접속하지 않아요)
const AUTH_PAGES = [routes.login, routes.signup]; // 로그인 뒤 다시 로그인 화면으로 가지 않게

/**
 * 돌아갈 주소가 우리 사이트 안이면 그 주소, 아니면 목록 주소.
 *
 * @example
 * safeCallbackUrl("/studies/write")        // "/studies/write"
 * safeCallbackUrl("https://evil.example")  // "/studies"
 * safeCallbackUrl("//evil.example")        // "/studies" (주소창은 이걸 바깥 사이트로 읽어요)
 */
export function safeCallbackUrl(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) return FALLBACK;

  // 브라우저와 같은 규칙으로 주소를 읽어 봐요.
  // "//evil", "/\evil", 탭 · 줄바꿈 끼운 주소처럼 눈으로 보면 안쪽 같아도 바깥으로 가는 경우를 잡아요.
  let url: URL;
  try {
    url = new URL(value, CHECK_ORIGIN);
  } catch {
    return FALLBACK;
  }
  if (url.origin !== CHECK_ORIGIN) return FALLBACK;
  if (AUTH_PAGES.some((page) => url.pathname === page)) return FALLBACK;

  return `${url.pathname}${url.search}${url.hash}`;
}
