"use client";

import { useCallback, useEffect, useState } from "react";

type FlashNoticeOptions = {
  /** 주소에서 지울 이름 (기본 "notice" → ?notice=logged-out) */
  param?: string;
  /** 몇 ms 뒤에 저절로 사라질지 (기본 5000 = 5초) */
  duration?: number;
};

/**
 * 잠깐 보였다 사라지는 안내 — "로그아웃했어요" 같은 한 번만 볼 안내에 써요.
 *
 * - 처음 열리면 주소에서 `?notice=…`를 지워요 → 새로고침해도 다시 안 보여요
 *   (새로고침 없이 주소만 바꾸는 `history.replaceState`, Next 공식 지원)
 * - `duration`이 지나면 저절로 사라져요
 * - `hide()`를 부르면 바로 사라져요 (예: 글자를 입력할 때, 버튼을 누를 때)
 *
 * @example
 * const [noticeVisible, hideNotice] = useFlashNotice(Boolean(notice));
 * <form onInput={hideNotice}>
 *   {notice && noticeVisible && <FormAlert tone={notice.tone}>{notice.message}</FormAlert>}
 * </form>
 */
export function useFlashNotice(
  hasNotice: boolean,
  { param = "notice", duration = 5000 }: FlashNoticeOptions = {},
) {
  const [visible, setVisible] = useState(hasNotice);
  const hide = useCallback(() => setVisible(false), []);

  useEffect(() => {
    if (!hasNotice) return;

    // 1. 주소에서 안내 이름만 지우기 (?callbackUrl= 같은 나머지는 그대로)
    const url = new URL(window.location.href);
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      window.history.replaceState(null, "", url);
    }

    // 2. 시간이 지나면 저절로 사라지기 (화면을 떠나면 타이머도 정리)
    const timer = window.setTimeout(hide, duration);
    return () => window.clearTimeout(timer);
  }, [hasNotice, param, duration, hide]);

  return [visible, hide] as const;
}
