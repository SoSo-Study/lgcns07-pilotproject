// 강사님 API 공통 응답 모양 (11/11 스웨거 · 실제 응답으로 확인)
// - 성공: { success: true, message: "OK", data }            ← code 없음
// - 실패: { success: false, message: "…", code: "NOT_FOUND" } ← code는 글자, data 없음
// 화면에는 message를 그대로 보여 줘요 (실패 문구가 한국어로 와요).
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  code?: string; // 실패할 때만: "UNAUTHORIZED" · "FORBIDDEN" · "NOT_FOUND" · "CONFLICT" …
  data: T;
};
