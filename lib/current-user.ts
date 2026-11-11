// 지금 로그인한 사람 정보 — 서버에서만 불러요 (액션 · 서비스 안에서)
// 🧪 로그인(#4)이 붙기 전까지는 가짜 사용자를 돌려줘요.
//    #4가 끝나면 이 함수 안쪽만 NextAuth 세션(getServerSession)으로 바꾸면 돼요.
//    로그인 안 했으면 null을 돌려주면 돼요.
// 🔒 "내 것"은 이 함수로 서버가 정해요. 내 id를 주소 · 폼으로 받지 않아요.
export type CurrentUser = {
  userId: number;
  nickname: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return { userId: 7, nickname: "front_park" }; // 🧪 가짜 데이터의 스터디장 중 한 명
}
