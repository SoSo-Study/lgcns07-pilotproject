// 로그인 화면 위 안내 문구 표: /login?notice=logged-out → "로그아웃했어요."
// 🔒 주소에 쓴 글자를 화면에 그대로 띄우지 않아요. 이 표에 있는 값만 문구로 바꿔요.
//    (그대로 띄우면 ?notice=고객센터 010-…로 전화하세요 같은 가짜 안내를 끼워 넣을 수 있어요)
export const authNotices = {
  "logged-out": { tone: "info", message: "로그아웃했어요." },
  "signed-up": { tone: "success", message: "가입했어요. 로그인해 주세요." },
  "password-reset": {
    tone: "success",
    message: "비밀번호를 바꿨어요. 새 비밀번호로 로그인해 주세요.",
  },
  expired: {
    tone: "info",
    message: "로그인이 만료됐어요. 다시 로그인해 주세요.",
  },
} as const;

export type AuthNoticeKey = keyof typeof authNotices;
export type AuthNotice = (typeof authNotices)[AuthNoticeKey];

/**
 * 주소의 notice 값 → 안내 문구. 표에 없으면 null.
 *
 * @example
 * getAuthNotice("logged-out") // { tone: "info", message: "로그아웃했어요." }
 * getAuthNotice("아무말")      // null
 */
export function getAuthNotice(value: unknown): AuthNotice | null {
  // Object.hasOwn: "toString" 같은 모든 객체에 숨어 있는 이름은 걸러요
  if (typeof value !== "string" || !Object.hasOwn(authNotices, value)) {
    return null;
  }
  return authNotices[value as AuthNoticeKey];
}
