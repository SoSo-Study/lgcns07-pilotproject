// 비밀번호 찾기(보안키 요청) 규칙 — 숫자는 여기 한 곳에서만 고쳐요 (#73)

/** 보안키 유효 시간 (강사님 API 기본값 30분) — 화면 안내에 써요 */
export const RESET_TOKEN_TTL_MINUTES = 30;

/** 같은 이메일로 이 시간 안에 보안키를 요청할 수 있는 횟수 */
export const RESET_REQUEST_MAX = 3;
export const RESET_REQUEST_WINDOW_MS = 10 * 60 * 1000; // 10분

/** 다시 보내기 버튼을 누를 수 있을 때까지 기다리는 시간 (화면) */
export const RESET_RESEND_WAIT_SECONDS = 60;

/** 너무 많이 요청했을 때 문구 — 가입한 이메일이든 아니든 똑같이 (가입 여부가 새지 않게) */
export const RESET_TOO_MANY_MESSAGE = `요청이 너무 많아요. ${
  RESET_REQUEST_WINDOW_MS / 60_000
}분 뒤에 다시 시도해 주세요.`;

/** 비밀번호 바꾸기에 실패했을 때 문구 — 서버 문구 대신 우리 말로 (서버가 영어 · 규칙 문구를 줄 때가 있어요) */
export const RESET_FAILED_MESSAGE =
  "보안키가 맞지 않거나 만료됐어요. 보안키를 다시 받아 주세요.";

/** 보안키를 보낸 뒤 문구 — 가입한 이메일이든 아니든 똑같이 */
export const RESET_SENT_MESSAGE = `이메일이 등록돼 있다면 보안키를 보냈어요. ${RESET_TOKEN_TTL_MINUTES}분 안에 입력해 주세요.`;
