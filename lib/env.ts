import "server-only";

// 서버에서만 읽는 환경 변수 (🔒 #45 A2)
// 값이 없으면 조용히 넘어가지 않고 바로 알려 줘요 — "제대로 읽어 가지 않으면 터지게끔"(강의 11/4)
// `?? ""`처럼 빈 값으로 넘기면 엉뚱한 곳에서 늦게 실패해서 원인을 찾기 어려워요.
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `환경 변수 ${name}이(가) 없어요. .env.local(배포는 Vercel 설정)을 확인해 주세요.`,
    );
  }
  return value;
}

export const env = {
  // 강사님 API 서버 주소 — NEXT_PUBLIC_을 붙이지 않아서 브라우저로 안 나가요
  get apiUrl() {
    return required("API_URL").replace(/\/$/, "");
  },
  // 로그인 쿠키를 암호화 · 서명하는 비밀값 — 없으면 로그인이 조용히 깨지지 않게 바로 알려요
  get nextAuthSecret() {
    return required("NEXTAUTH_SECRET");
  },
  // 테스트 서버의 시연용 인증번호(demoCode)를 화면에 보여 줄지 — "true"일 때만 (발표 · 시험용)
  // 실서비스에선 꺼 두면, 혹시 백엔드가 번호를 보내도 화면으로 안 나가요
  get showDemoCode() {
    return process.env.SHOW_DEMO_CODE === "true";
  },
};
