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
  login: "/login",
  signup: "/signup",
} as const;
