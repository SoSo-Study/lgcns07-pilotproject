import "server-only";
import {
  LOGIN_FAILURE_WINDOW_MS,
  LOGIN_LOCK_MS,
  LOGIN_MAX_FAILURES,
} from "@/config/login-limit";

// 로그인 실패 횟수를 서버에서 세는 곳 (#53)
// 🔒 화면(브라우저)이 아니라 서버에서 세요 — 화면 검사는 개발자도구로 우회돼요 (강의 11/2 · 11/3)
// 🔒 이메일 · 비밀번호 · 남은 횟수를 로그에 찍지 않아요 (강의 11/2 · 11/5)
//
// ⚠ 한계: Next 서버의 메모리(Map)에 적어서
//   - 서버를 껐다 켜면 처음부터
//   - Vercel처럼 서버가 여러 대로 뜨면 서버마다 따로 세요 (11/5 "서버 여러 대" 캐시 이야기와 같은 문제)
//   실서비스에선 Redis · DB처럼 모든 서버가 같이 보는 곳에 적거나, 백엔드(Spring)에서도 막아요.

type Record = {
  failures: number[]; // 틀린 시각들
  lockedUntil: number; // 이 시각까지 잠김 (0이면 안 잠김)
};

const records = new Map<string, Record>();

/** 같은 IP + 같은 이메일을 한 묶음으로 세요 (대소문자 · 앞뒤 빈칸은 무시) */
export function attemptKey(ip: string, email: string) {
  return `${ip}|${email.trim().toLowerCase()}`;
}

/** 지금 잠겨 있으면 남은 시간(ms), 아니면 0 */
export function lockedFor(key: string, now = Date.now()) {
  const record = records.get(key);
  if (!record || record.lockedUntil <= now) return 0;
  return record.lockedUntil - now;
}

/** 틀렸을 때 — 10분 안에 5번째면 5분 잠가요 */
export function recordFailure(key: string, now = Date.now()) {
  const record = records.get(key) ?? { failures: [], lockedUntil: 0 };
  record.failures = record.failures.filter(
    (time) => now - time < LOGIN_FAILURE_WINDOW_MS,
  );
  record.failures.push(now);

  if (record.failures.length >= LOGIN_MAX_FAILURES) {
    record.lockedUntil = now + LOGIN_LOCK_MS;
    record.failures = []; // 잠금이 풀리면 다시 5번 기회
  }
  records.set(key, record);
  cleanUp(now);
}

/** 성공했을 때 — 틀린 횟수를 처음부터 */
export function clearFailures(key: string) {
  records.delete(key);
}

// 오래된 기록 청소 — 계속 쌓여서 메모리가 늘지 않게 (기록이 많을 때만)
function cleanUp(now: number) {
  if (records.size < 1000) return;
  for (const [key, record] of records) {
    const recent = record.failures.some(
      (time) => now - time < LOGIN_FAILURE_WINDOW_MS,
    );
    if (!recent && record.lockedUntil <= now) records.delete(key);
  }
}
