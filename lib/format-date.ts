// 날짜를 피그마 표기 "2026.11.18"로
// - "2026-11-18"(날짜만, 예: 마감일)은 그대로 점으로
// - "2026-11-11T07:29:22Z"(시각까지, 서버는 UTC)는 한국 시간 날짜로 바꿔서
//   → 안 바꾸면 밤 9시 이후에 쓴 글이 하루 전 날짜로 보여요 (#46 1-4)
const seoulDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDate(value: string) {
  if (value.length <= 10) return value.replaceAll("-", ".");

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10).replaceAll("-", ".");
  }
  return seoulDate.format(date).replaceAll("-", "."); // "2026-11-11" → "2026.11.11"
}
