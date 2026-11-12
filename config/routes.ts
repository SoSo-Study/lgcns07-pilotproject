import type { AuthNoticeKey } from "@/config/auth-notice";

// 화면 주소는 여기서만 만든다. 코드에 "/studies/3" 같은 글자를 직접 쓰지 않기.
// 예: <Link href={routes.study(study.studyId)}>
export const routes = {
  home: "/",
  studies: "/studies",
  study: (studyId: number | string) => `/studies/${studyId}`,
  studyWrite: "/studies/write",
  studyEdit: (studyId: number | string) => `/studies/write?studyId=${studyId}`,
  myStudies: "/my-studies",
  uiKit: "/ui-kit", // 🧩 부품 모음 (팀원용 견본)
  applicants: "/applicants",
  profile: "/profile", // ⑧ 내 프로필 (#42) — 탭은 ?tab=applied · mine · password
  login: "/login",
  loginNotice: (notice: AuthNoticeKey) => `/login?notice=${notice}`, // 로그인 화면 + 안내 문구
  signup: "/signup",
  forgotPassword: "/forgot-password", // 비밀번호 찾기 (보안키 받기)
  resetPassword: "/reset-password", // 보안키로 비밀번호 다시 만들기
  findId: "/find-id", // 아이디(이메일) 찾기
} as const;
