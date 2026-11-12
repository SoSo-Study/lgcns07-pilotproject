"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useCarousel } from "@/components/ui/carousel";

/**
 * 캐러셀이 지금 몇 번 슬라이드인지 알려 줘요 (0부터). `<Carousel>` 안쪽에서만 쓸 수 있어요.
 * 버튼 · 밀기 · 페이저 · 명령어, 무엇으로 넘겨도 같이 바뀌어요.
 *
 * @example
 * const selected = useCarouselSelected(); // 0, 1, 2 …
 */
export function useCarouselSelected() {
  const { api } = useCarousel(); // 캐러셀 리모컨 (준비 전에는 undefined)

  // 캐러셀이 "바뀌었어요"라고 알려 줄 때마다 React가 번호를 다시 읽게 연결
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!api) return () => {};
      api.on("select", onChange);
      api.on("reInit", onChange);
      return () => {
        api.off("select", onChange);
        api.off("reInit", onChange);
      };
    },
    [api],
  );

  return useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0, // 브라우저: 지금 번호
    () => 0, // 서버에서 처음 그릴 때: 첫 장
  );
}
