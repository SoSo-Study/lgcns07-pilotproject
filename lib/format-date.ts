// "2026-11-18" 또는 "2026-11-18T09:00:00" → "2026.11.18" (피그마 표기)
export function formatDate(value: string) {
  return value.slice(0, 10).replaceAll("-", ".");
}
