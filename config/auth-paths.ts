import { routes } from "@/config/routes";

// 로그인 문지기(proxy.ts)가 보는 주소 목록 — 한 곳에서만 고쳐요 (강의 11/4: config/initial.ts)

/** 로그인해야 들어갈 수 있는 주소 (이 주소로 시작하면 전부) */
export const protectedPaths = [
  routes.myStudies,
  routes.studyWrite,
  routes.applicants,
  routes.profile, // ⑧ 내 프로필 (#42)
];

/** 로그인했으면 들어갈 필요가 없는 주소 → 목록으로 */
export const guestOnlyPaths = [routes.login, routes.signup];
