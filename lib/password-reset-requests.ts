import "server-only";
import {
  RESET_REQUEST_MAX,
  RESET_REQUEST_WINDOW_MS,
} from "@/config/password-reset-limit";

// 보안키 요청 횟수를 서버에서 세는 곳 (#73)
// 🔒 남의 이메일로 "보안키 받기"를 계속 눌러 메일을 쏟아붓는 장난을 막아요.
//    화면의 60초 대기는 개발자도구로 우회되니까, 서버에서 한 번 더 세요.
// 🔒 이메일을 로그에 찍지 않아요.
//
// ⚠ 한계는 로그인 잠금(lib/login-attempts.ts)과 같아요: Next 서버 메모리(Map)에 적어서
//   서버를 껐다 켜면 처음부터, 서버가 여러 대면 서버마다 따로 세요.

const requests = new Map<string, number[]>(); // 이메일 → 요청한 시각들

/**
 * 이 이메일로 지금 보안키를 요청해도 되는지. 되면 요청 한 번으로 세고 true.
 * 가입한 이메일인지와 상관없이 세요 (가입 여부가 새지 않게).
 */
export function allowResetRequest(email: string, now = Date.now()) {
  const key = email.trim().toLowerCase();
  const recent = (requests.get(key) ?? []).filter(
    (time) => now - time < RESET_REQUEST_WINDOW_MS,
  );
  if (recent.length >= RESET_REQUEST_MAX) {
    requests.set(key, recent);
    return false;
  }
  recent.push(now);
  requests.set(key, recent);
  cleanUp(now);
  return true;
}

// 오래된 기록 청소 — 계속 쌓여서 메모리가 늘지 않게 (기록이 많을 때만)
function cleanUp(now: number) {
  if (requests.size < 1000) return;
  for (const [key, times] of requests) {
    if (!times.some((time) => now - time < RESET_REQUEST_WINDOW_MS)) {
      requests.delete(key);
    }
  }
}
