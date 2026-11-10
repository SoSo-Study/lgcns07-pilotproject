const DAY = 24 * 60 * 60 * 1000;

// 오늘(한국 시간)부터 마감일까지 남은 날. 오늘 마감이면 0, 지났으면 음수
// 서버(Vercel)는 UTC 시간이라, 한국 날짜를 직접 구해야 새벽에 하루 어긋나지 않아요.
export function daysLeft(deadline: string, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(now); // "2026-11-10"
  return Math.round(
    (Date.parse(deadline.slice(0, 10)) - Date.parse(today)) / DAY,
  );
}

// 7 → "D-7", 0 → "D-day", -1 → "마감"
export function formatDaysLeft(days: number) {
  if (days > 0) return `D-${days}`;
  if (days === 0) return "D-day";
  return "마감";
}
