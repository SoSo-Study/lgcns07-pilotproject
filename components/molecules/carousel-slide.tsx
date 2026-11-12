"use client";

import type { ComponentProps } from "react";
import { CarouselItem } from "@/components/ui/carousel";
import { useCarouselSelected } from "@/hooks/use-carousel-selected";

type CarouselSlideProps = ComponentProps<typeof CarouselItem> & {
  /** 이 슬라이드의 번호 (0부터) */
  index: number;
};

/**
 * 캐러셀 슬라이드 한 칸 — shadcn `CarouselItem`에 한 가지만 더했어요:
 * 지금 보이는 슬라이드가 아니면 `inert`(누르기 · Tab · 화면 읽기에서 제외)로 둬요.
 * 그래서 화면에 없는 슬라이드의 버튼으로 Tab이 가지 않아요.
 *
 * @example
 * <CarouselSlide index={0}><BannerSlide slide={slide} /></CarouselSlide>
 */
export function CarouselSlide({ index, ...props }: CarouselSlideProps) {
  const selected = useCarouselSelected();

  return <CarouselItem inert={index !== selected} {...props} />;
}
