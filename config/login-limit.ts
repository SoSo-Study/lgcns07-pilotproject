// 로그인 잠금 규칙 — 숫자는 여기 한 곳에서만 고쳐요 (#53)
// "10분 안에 5번 틀리면 5분 동안 막기"

/** 이만큼 틀리면 잠가요 */
export const LOGIN_MAX_FAILURES = 5;

/** 틀린 횟수를 세는 시간 (이 시간이 지난 실패는 잊어요) */
export const LOGIN_FAILURE_WINDOW_MS = 10 * 60 * 1000; // 10분

/** 잠그는 시간 */
export const LOGIN_LOCK_MS = 5 * 60 * 1000; // 5분

/** 잠겼을 때 NextAuth가 화면에 넘겨주는 신호 (문구가 아니라 약속한 코드) */
export const LOGIN_LOCKED_CODE = "TOO_MANY_ATTEMPTS";

/** 잠겼을 때 문구 — 이메일이 있든 없든 똑같이 (가입 여부가 새지 않게) */
export const LOGIN_LOCKED_MESSAGE = `로그인 시도가 너무 많아요. ${
  LOGIN_LOCK_MS / 60_000
}분 뒤에 다시 시도해 주세요.`;
