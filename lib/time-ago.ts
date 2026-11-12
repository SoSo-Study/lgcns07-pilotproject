import { formatDate } from "@/lib/format-date";

// "방금 · 5분 전 · 2시간 전", 하루가 넘으면 "2026.11.10" (피그마 ② 댓글 시각)
// ⚠ "지금 시간"을 써서 화면을 미리 그릴 때는 못 써요 → 요청 때 그리는 곳(상세)에서만
export function timeAgo(value: string, now = Date.now()) {
  const diff = now - new Date(value).getTime();
  if (Number.isNaN(diff)) return formatDate(value);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "방금";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return formatDate(value);
}
