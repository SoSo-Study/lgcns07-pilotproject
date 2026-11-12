"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 거꾸로 세는 타이머 — 인증번호 남은 시간(10:00), 다시 보내기 대기(60초) 등에 써요.
 *
 * - `start(초)`: 시작 (다시 부르면 처음부터)
 * - `stop()`: 멈추고 0으로
 * - `remaining`: 남은 초 / `running`: 아직 남았는지 / `finished`: 시작했는데 0이 됐는지
 *
 * @example
 * const codeTimer = useCountdown();
 * codeTimer.start(600);
 * <span>{formatClock(codeTimer.remaining)}</span> // "9:42"
 */
export function useCountdown() {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (endsAt === null) return;
    // 1초마다 지금 시각을 새로 읽어요. 끝나면 타이머를 멈춰요
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= endsAt) window.clearInterval(timer);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  const start = useCallback((seconds: number) => {
    const current = Date.now();
    setNow(current);
    setEndsAt(current + seconds * 1000);
  }, []);

  const stop = useCallback(() => setEndsAt(null), []);

  // 남은 초는 따로 저장하지 않고 "끝나는 시각 - 지금"으로 계산해요 (탭을 오래 비워도 정확)
  const remaining =
    endsAt === null ? 0 : Math.max(0, Math.ceil((endsAt - now) / 1000));

  return {
    remaining,
    running: remaining > 0,
    finished: endsAt !== null && remaining === 0,
    start,
    stop,
  };
}

/** 초 → "분:초" (예: 582 → "9:42") */
export function formatClock(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`;
}
